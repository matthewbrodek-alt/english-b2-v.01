import { DialogueExchange, TestQuestion } from "./content";

export type TranscriptionResult = {
  text: string;
  source: "backend" | "demo";
};

export type VoiceMatch = {
  optionIndex: number;
  confidence: number;
};

type TestTranscribeInput = {
  audioUri: string | null;
  question: TestQuestion;
};

type DialogueTranscribeInput = {
  audioUri: string | null;
  exchange: DialogueExchange;
};

type AudioTranscribeInput = {
  audioUri: string | null;
  demoTranscript: string;
  fileName?: string;
  promptId: string;
};

const letters = ["a", "b", "c", "d"];

export async function transcribeAudioAnswer({
  audioUri,
  demoTranscript,
  fileName = "voice-answer.m4a",
  promptId
}: AudioTranscribeInput): Promise<TranscriptionResult> {
  const endpoint = process.env.EXPO_PUBLIC_STT_ENDPOINT;

  if (endpoint && audioUri) {
    const formData = new FormData();
    const audioFile = {
      uri: audioUri,
      name: fileName,
      type: "audio/m4a"
    } as unknown as Blob;

    formData.append("audio", audioFile);
    formData.append("promptId", promptId);
    formData.append("questionId", promptId);

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Speech-to-text failed with ${response.status}`);
    }

    const payload = (await response.json()) as { text?: string; transcript?: string };
    return {
      text: payload.text ?? payload.transcript ?? "",
      source: "backend"
    };
  }

  return {
    text: demoTranscript,
    source: "demo"
  };
}

export async function transcribeVoiceAnswer({
  audioUri,
  question
}: TestTranscribeInput): Promise<TranscriptionResult> {
  const correctLetter = letters[question.correctIndex].toUpperCase();

  return transcribeAudioAnswer({
    audioUri,
    demoTranscript: `Demo transcript: I choose option ${correctLetter}. ${question.options[question.correctIndex]}`,
    fileName: "test-answer.m4a",
    promptId: question.id
  });
}

export async function transcribeDialogueAnswer({
  audioUri,
  exchange
}: DialogueTranscribeInput): Promise<TranscriptionResult> {
  return transcribeAudioAnswer({
    audioUri,
    demoTranscript:
      "Demo transcript: From my point of view, I would answer with one concrete example, a clear reason, and a follow-up question.",
    fileName: "dialogue-answer.m4a",
    promptId: `dialogue-${exchange.number}`
  });
}

export function matchTranscriptToOption(transcript: string, options: string[]): VoiceMatch {
  const normalized = normalize(transcript);

  for (let index = 0; index < letters.length; index += 1) {
    const letter = letters[index];
    if (
      normalized.includes(`option ${letter}`) ||
      normalized.includes(`answer ${letter}`) ||
      normalized === letter
    ) {
      return { optionIndex: index, confidence: 1 };
    }
  }

  const scores = options.map((option) => {
    const optionTokens = tokenize(option);
    const transcriptTokens = new Set(tokenize(transcript));
    if (optionTokens.length === 0) {
      return 0;
    }

    const overlap = optionTokens.filter((token) => transcriptTokens.has(token)).length;
    return overlap / optionTokens.length;
  });

  const bestScore = Math.max(...scores);
  const optionIndex = scores.indexOf(bestScore);

  return {
    optionIndex,
    confidence: bestScore
  };
}

function tokenize(value: string) {
  return normalize(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
