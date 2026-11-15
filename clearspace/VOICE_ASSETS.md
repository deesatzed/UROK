# Spoken cues

The 23 bundled MP3s (640,756 bytes total) are produced ahead of time. The text lives in `src/data/guideCues.json` and `src/data/reminders.json`. The aftercare and worry paths use the same recordings and local playback mechanism as SOS. Personal reminders are keyed by their full text, so changing a reminder never plays a stale clip.

These stock clips use Piper 1.8.0 with the US English LJSpeech medium voice, length scale 1.08. The model card identifies its training dataset as public domain. The final files are mono MP3 at 24 kHz and 48 kbps, normalized with FFmpeg loudnorm at −19 LUFS and −2 dBTP. Piper and its weights are offline production tools. Neither ships in the app.

- [Voice and model card](https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/ljspeech/medium)
- [LJ Speech dataset](https://keithito.com/LJ-Speech-Dataset/)

## Optional ZONOS3-Mini voice

Only the explicit preparation button opens the WebGPU engine. Model assets are downloaded from Zyphra on Hugging Face. Selected cue text is submitted to the runtime inside a same-origin frame through a MessageChannel. A complete pack contains the selected opening, optional pinned reminder, hand cue and exercise-choice cue. Changing the plan immediately selects matching clips, with included recordings or a local device voice for everything else. Removing a saved voice deletes its clips from IndexedDB.

The three bundled engine files come from Zyphra's upstream build at commit `96d9e0ec1e39083ed336ac78f24e3dbc93721c0f`. The worker's model root points at Hugging Face revision `d2d142a86b1e6aeb4252679673c86ecd86177bf8`. Keep the accompanying notices when updating the engine. Model weights and optional engine code are excluded from the offline shell. The ordinary browser HTTP cache may retain downloads.

- [ZONOS3 runtime and bundled source](https://github.com/Zyphra/ZONOS3-Mini/tree/96d9e0ec1e39083ed336ac78f24e3dbc93721c0f)
- [Model release and license](https://huggingface.co/Zyphra/ZONOS3-Mini/tree/d2d142a86b1e6aeb4252679673c86ecd86177bf8)
