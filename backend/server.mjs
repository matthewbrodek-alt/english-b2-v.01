import http from "node:http";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvFile(join(__dirname, ".env"));

const PORT = Number(process.env.PORT ?? 8787);
const MAX_AUDIO_BYTES = Number(process.env.MAX_AUDIO_BYTES ?? 12 * 1024 * 1024);
const PYTHON_BIN = process.env.PYTHON_BIN ?? "python";
const LOCAL_STT_MODEL = process.env.LOCAL_STT_MODEL ?? "base.en";
const LOCAL_STT_DEVICE = process.env.LOCAL_STT_DEVICE ?? "cpu";
const LOCAL_STT_COMPUTE_TYPE = process.env.LOCAL_STT_COMPUTE_TYPE ?? "int8";
const LOCAL_STT_LANGUAGE = process.env.LOCAL_STT_LANGUAGE ?? "en";
const LOCAL_STT_TIMEOUT_MS = Number(process.env.LOCAL_STT_TIMEOUT_MS ?? 120000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "*";

const server = http.createServer(async (request, response) => {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, {
      ok: true,
      provider: "faster-whisper",
      service: "english-cat-coach-stt",
      sttModel: LOCAL_STT_MODEL
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/speech-to-text") {
    try {
      const contentType = request.headers["content-type"] ?? "";
      const boundary = getBoundary(contentType);

      if (!boundary) {
        sendJson(response, 400, { error: "Expected multipart/form-data request." });
        return;
      }

      const body = await readBody(request, MAX_AUDIO_BYTES);
      const multipart = parseMultipart(body, boundary);
      const audio = multipart.files.audio;

      if (!audio) {
        sendJson(response, 400, { error: "Missing audio file field." });
        return;
      }

      const transcript = await transcribeAudio(audio);

      sendJson(response, 200, {
        promptId: multipart.fields.promptId ?? multipart.fields.questionId ?? null,
        source: "faster-whisper",
        text: transcript,
        transcript
      });
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : "Unknown speech-to-text error."
      });
    }
    return;
  }

  sendJson(response, 404, { error: "Not found." });
});

server.listen(PORT, () => {
  console.log(`English Cat Coach free STT backend listening on http://localhost:${PORT}`);
  console.log(`Provider: faster-whisper, model: ${LOCAL_STT_MODEL}, device: ${LOCAL_STT_DEVICE}, compute: ${LOCAL_STT_COMPUTE_TYPE}`);
});

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function getBoundary(contentType) {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  return match?.[1] ?? match?.[2] ?? null;
}

function readBody(request, limitBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    request.on("data", (chunk) => {
      total += chunk.length;

      if (total > limitBytes) {
        reject(new Error(`Audio request is too large. Limit is ${limitBytes} bytes.`));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

function parseMultipart(body, boundary) {
  const delimiter = Buffer.from(`--${boundary}`);
  const files = {};
  const fields = {};
  let cursor = body.indexOf(delimiter);

  while (cursor !== -1) {
    const next = body.indexOf(delimiter, cursor + delimiter.length);

    if (next === -1) {
      break;
    }

    const part = body.subarray(cursor + delimiter.length, next);
    cursor = next;

    if (part.length < 4) {
      continue;
    }

    const trimmed = trimCrlf(part);
    const headerEnd = trimmed.indexOf(Buffer.from("\r\n\r\n"));

    if (headerEnd === -1) {
      continue;
    }

    const rawHeaders = trimmed.subarray(0, headerEnd).toString("utf8");
    const content = trimCrlf(trimmed.subarray(headerEnd + 4));
    const name = /name="([^"]+)"/i.exec(rawHeaders)?.[1];

    if (!name) {
      continue;
    }

    const filename = /filename="([^"]*)"/i.exec(rawHeaders)?.[1];
    const contentType = /content-type:\s*([^\r\n]+)/i.exec(rawHeaders)?.[1] ?? "application/octet-stream";

    if (filename) {
      files[name] = {
        buffer: content,
        contentType,
        filename
      };
    } else {
      fields[name] = content.toString("utf8");
    }
  }

  return { fields, files };
}

function trimCrlf(buffer) {
  let start = 0;
  let end = buffer.length;

  while (start < end && (buffer[start] === 13 || buffer[start] === 10)) {
    start += 1;
  }

  while (end > start && (buffer[end - 1] === 13 || buffer[end - 1] === 10)) {
    end -= 1;
  }

  return buffer.subarray(start, end);
}

async function transcribeAudio(audio) {
  const workDir = join(tmpdir(), `english-cat-coach-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(workDir, { recursive: true });
  const audioPath = join(workDir, sanitizeFilename(audio.filename || "voice-answer.m4a"));

  try {
    await writeFile(audioPath, audio.buffer);
    const payload = await runFasterWhisper(audioPath);
    return payload.text ?? payload.transcript ?? "";
  } finally {
    await rm(workDir, { force: true, recursive: true });
  }
}

function runFasterWhisper(audioPath) {
  return new Promise((resolve, reject) => {
    const scriptPath = join(__dirname, "transcribe.py");
    const args = [
      scriptPath,
      "--audio",
      audioPath,
      "--model",
      LOCAL_STT_MODEL,
      "--device",
      LOCAL_STT_DEVICE,
      "--compute-type",
      LOCAL_STT_COMPUTE_TYPE,
      "--language",
      LOCAL_STT_LANGUAGE
    ];
    const child = spawn(PYTHON_BIN, args, {
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8"
      },
      windowsHide: true
    });
    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Local faster-whisper timed out after ${LOCAL_STT_TIMEOUT_MS}ms.`));
    }, LOCAL_STT_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);

      if (code !== 0) {
        reject(new Error(parsePythonError(stderr) ?? stderr.trim() ?? `faster-whisper exited with code ${code}.`));
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error(`Could not parse faster-whisper output: ${stdout}`));
      }
    });
  });
}

function parsePythonError(stderr) {
  const lines = stderr
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const lastLine = lines.at(-1);

  if (!lastLine) {
    return null;
  }

  try {
    const payload = JSON.parse(lastLine);
    return payload.error;
  } catch {
    return null;
  }
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const content = readFileSync(path, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
