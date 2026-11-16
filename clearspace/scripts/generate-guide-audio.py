#!/usr/bin/env python3
"""Prepare static guide recordings with Piper 1.8.0 and FFmpeg (development only).

python scripts/generate-guide-audio.py --model /path/en_US-ljspeech-medium.onnx
The app never loads Piper, its weights, or this script.
"""

import argparse
import hashlib
import importlib.metadata
import json
from pathlib import Path
import subprocess
import tempfile
import wave

from piper import PiperVoice, SynthesisConfig


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", type=Path, required=True)
    args = parser.parse_args()
    app = Path(__file__).resolve().parent.parent
    cues = json.loads((app / "src/data/guideCues.json").read_text())
    narration = json.loads((app / "src/data/guideNarration.json").read_text())
    reminders = json.loads((app / "src/data/reminders.json").read_text())
    entries = [
        (key, [" ".join(filter(None, [cue["title"], cue["body"]]))], "brief")
        for key, cue in cues.items()
    ]
    entries += [(f"reminder{i + 1}", [text], "brief") for i, text in enumerate(reminders)]
    entries += [(f"{key}-gentle", sentences, "gentle") for key, sentences in narration.items()]
    voice = PiperVoice.load(str(args.model))
    output = app / "public/voices"
    output.mkdir(exist_ok=True)
    manifest = {
        "engine": f"Piper {importlib.metadata.version('piper-tts')}",
        "model": args.model.name,
        "modelSha256": hashlib.sha256(args.model.read_bytes()).hexdigest(),
        "clips": {},
    }
    with tempfile.TemporaryDirectory(prefix="clearspace-voice-") as folder:
        for key, sentences, style in entries:
            timed_breath = key in ("breathIn", "breathOut")
            gap = 0.7 if style == "gentle" else 0.35
            lead = 0.2 if not timed_breath else 0.08
            tail = 1.4 if not timed_breath else 0.12
            config = SynthesisConfig(length_scale=1.16 if style == "gentle" else 1.08)
            wav_path = Path(folder) / f"{key}.wav"
            with wave.open(str(wav_path), "wb") as wav:
                wav.setframerate(voice.config.sample_rate)
                wav.setsampwidth(2)
                wav.setnchannels(1)
                silence = lambda seconds: bytes(int(voice.config.sample_rate * seconds) * 2)
                wav.writeframes(silence(lead))
                first = True
                for sentence in sentences:
                    for chunk in voice.synthesize(sentence, config):
                        if not first:
                            wav.writeframes(silence(gap))
                        wav.writeframes(chunk.audio_int16_bytes)
                        first = False
                wav.writeframes(silence(tail))
            mp3 = output / f"{key}.mp3"
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(wav_path), "-af", "loudnorm=I=-20:TP=-2:LRA=7,afade=t=in:d=0.05",
                "-ar", "24000", "-ac", "1", "-b:a", "48k", str(mp3),
            ], check=True)
            duration = float(subprocess.check_output([
                "ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1", str(mp3),
            ], text=True).strip())
            if timed_breath and duration >= 4:
                raise RuntimeError(f"{key} would overrun the optional breathing interval")
            manifest["clips"][key] = {
                "text": " ".join(sentences), "style": style,
                "durationSeconds": round(duration, 3),
                "leadSeconds": lead, "tailSeconds": tail, "sentenceGapSeconds": gap,
                "sha256": hashlib.sha256(mp3.read_bytes()).hexdigest(),
            }
            print(f"{key}: {duration:.1f}s", flush=True)
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    main()
