import argparse
import json
import os
import sys

from faster_whisper import WhisperModel


def main() -> int:
    parser = argparse.ArgumentParser(description="Local faster-whisper speech-to-text for English Cat Coach.")
    parser.add_argument("--audio", required=True, help="Path to the audio file.")
    parser.add_argument("--model", default=os.getenv("LOCAL_STT_MODEL", "base.en"))
    parser.add_argument("--device", default=os.getenv("LOCAL_STT_DEVICE", "cpu"))
    parser.add_argument("--compute-type", default=os.getenv("LOCAL_STT_COMPUTE_TYPE", "int8"))
    parser.add_argument("--language", default=os.getenv("LOCAL_STT_LANGUAGE", "en"))
    parser.add_argument("--beam-size", default=int(os.getenv("LOCAL_STT_BEAM_SIZE", "5")), type=int)
    args = parser.parse_args()

    try:
        model = WhisperModel(args.model, device=args.device, compute_type=args.compute_type)
        segments, info = model.transcribe(
            args.audio,
            beam_size=args.beam_size,
            language=args.language,
            vad_filter=True,
            condition_on_previous_text=False,
        )
        text = " ".join(segment.text.strip() for segment in segments if segment.text.strip()).strip()
        print(
            json.dumps(
                {
                    "language": info.language,
                    "languageProbability": info.language_probability,
                    "model": args.model,
                    "source": "faster-whisper",
                    "text": text,
                    "transcript": text,
                },
                ensure_ascii=False,
            )
        )
        return 0
    except Exception as error:
        print(
            json.dumps(
                {
                    "error": str(error),
                    "source": "faster-whisper",
                },
                ensure_ascii=False,
            ),
            file=sys.stderr,
        )
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
