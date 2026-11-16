# Spoken cues

The 39 bundled MP3s (2,756,580 bytes total) are produced ahead of time. Brief visible cues live in `src/data/guideCues.json`, longer spoken invitations in `src/data/guideNarration.json`, and reminders in `src/data/reminders.json`. The aftercare and worry paths use the same recordings and local playback mechanism as SOS. Personal reminders are keyed by their full text, so changing a reminder never plays a stale clip.

These stock clips use Piper 1.8.0 with the US English LJSpeech medium voice. Gentle guidance is the default, with a little orientation, an invitation to notice one detail, and permission to pause or move on. Its 16 recordings last about 17–23 seconds, with length scale 1.16, a 0.2-second lead-in, 0.7-second sentence gaps and 1.4 seconds of space at the end. These are design choices to evaluate, not a clinically established optimal duration. Settings retains an explicitly selectable brief style. Personal reminders keep the person's own words. The optional timed breath-in/out cues stay short enough to fit their four-second interval.

The model card identifies its training dataset as public domain. The final files are mono MP3 at 24 kHz and 48 kbps, normalized with FFmpeg loudnorm at −20 LUFS and −2 dBTP. Piper and its weights are offline production tools. Neither ships in the app. The new recordings add no runtime inference or paid speech service.

To regenerate, install `piper-tts==1.8.0` in a development environment with FFmpeg and run `python scripts/generate-guide-audio.py --model /path/en_US-ljspeech-medium.onnx` from this app. `public/voices/manifest.json` records each script, duration, timing choices, model hash and audio hash. Tests verify that the bundled words and files match the current scripts. Changing a script requires regeneration.

Audio never advances a support step. Pause/resume, mute, repeat, switching and leaving remain available. A paused voice stays paused across cue changes until the person resumes or turns listening off. Numbered grounding targets are optional inside the tap counter; the main cue asks for one detail.

- [Voice and model card](https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/ljspeech/medium)
- [LJ Speech dataset](https://keithito.com/LJ-Speech-Dataset/)

## Optional ZONOS3-Mini voice

Only the explicit preparation button opens the WebGPU engine. Model assets are downloaded from Zyphra on Hugging Face. Selected cue text is submitted to the runtime inside a same-origin frame through a MessageChannel. A complete pack contains the selected opening, optional pinned reminder, hand cue and exercise-choice cue in the chosen guidance style. ZONOS controls the timing of its own generated recordings; the bundled Piper timing settings do not apply to it. Older packs remain valid as brief cues. Settings explains when a saved pack uses a different style and allows selecting that style or preparing a new pack. Changing the plan selects matching clips for the next playback. Loading a saved pack does not interrupt a cue already playing. Prepared voices stay in the browser where they were created; another computer uses the included recordings until a voice is prepared there. Removing a saved voice deletes its clips from IndexedDB.

Guide playback uses prepared clips or the included recordings. It never silently switches to an operating-system speech voice. A custom reminder without prepared audio remains available as text. If the browser blocks playback, a play control allows an explicit retry. A failed prepared clip is fully stopped before the included recording is tried. Muting, leaving, and late playback results cannot restart a cancelled player. Only one guide instance or tab can play at a time in browsers with BroadcastChannel support; coordination sends only a playback signal, with no cue text. A voice preview stops when leaving Settings.

The three bundled engine files come from Zyphra's upstream build at commit `96d9e0ec1e39083ed336ac78f24e3dbc93721c0f`. The worker's model root points at Hugging Face revision `d2d142a86b1e6aeb4252679673c86ecd86177bf8`. Keep the accompanying notices when updating the engine. Model weights and optional engine code are excluded from the offline shell. The ordinary browser HTTP cache may retain downloads.

- [ZONOS3 runtime and bundled source](https://github.com/Zyphra/ZONOS3-Mini/tree/96d9e0ec1e39083ed336ac78f24e3dbc93721c0f)
- [Model release and license](https://huggingface.co/Zyphra/ZONOS3-Mini/tree/d2d142a86b1e6aeb4252679673c86ecd86177bf8)
