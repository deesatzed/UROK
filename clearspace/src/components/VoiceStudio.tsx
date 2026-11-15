import { useEffect, useRef, useState } from "react";
import {
  packTexts,
  removePack,
  renderPack,
  savePack,
  studioVoices,
  type PreparedPack,
  type StudioVoice,
} from "../services/voicePack";
import type { OpeningCue } from "../data/guide";

type Props = {
  opening: OpeningCue;
  phrase: string;
  pack: PreparedPack | null;
  onPack: (p: PreparedPack | null) => void;
};
export function VoiceStudio({ opening, phrase, pack, onPack }: Props) {
  const [voice, setVoice] = useState<StudioVoice>(
    pack?.voice ?? "default_b78b28baf5c31a1d",
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const work = useRef<AbortController | null>(null);
  const player = useRef<HTMLAudioElement>(null);
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!pack) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(pack.clips[0].audio);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [pack]);
  useEffect(() => () => work.current?.abort(), []);
  const prepare = async () => {
    if (work.current) return;
    player.current?.pause();
    const controller = new AbortController();
    work.current = controller;
    setBusy(true);
    setMessage("Opening the voice studio…");
    try {
      const p = await renderPack(
        voice,
        packTexts(opening, phrase),
        controller.signal,
        setMessage,
      );
      await savePack(p, controller.signal);
      if (!controller.signal.aborted) {
        onPack(p);
        setMessage("Your voice is ready on this device.");
      }
    } catch (err) {
      if (!controller.signal.aborted)
        setMessage(
          err instanceof Error
            ? err.message
            : "Your browser could not save the voice.",
        );
    } finally {
      if (work.current === controller) {
        work.current = null;
        setBusy(false);
      }
    }
  };
  const available =
    window.isSecureContext && "gpu" in navigator && "indexedDB" in window;
  return (
    <details className="voice-studio">
      <summary>Prepare a personal voice</summary>
      <p>
        Make audio for your SOS cues in a different voice. Preparing it can
        download about 1 GB. During support, your device simply plays the saved
        clips.
      </p>
      {!phrase && (
        <p>Choose a personal reminder above to include it in this voice.</p>
      )}
      {pack && (
        <div className="saved-voice">
          <p>Saved voice · {studioVoices[pack.voice]}</p>
          {preview && (
            <audio
              ref={player}
              controls
              preload="none"
              src={preview}
              aria-label="Preview saved voice"
            />
          )}
          <button
            className="text-action"
            disabled={busy}
            onClick={async () => {
              try {
                await removePack();
                onPack(null);
                setMessage("Saved voice removed.");
              } catch {
                setMessage("Your browser could not remove the voice.");
              }
            }}
          >
            Remove saved voice
          </button>
        </div>
      )}
      {available ? (
        <>
          <label>
            Voice
            <select
              value={voice}
              disabled={busy}
              onChange={(e) => setVoice(e.target.value as StudioVoice)}
            >
              {Object.entries(studioVoices).map(([id, label]) => (
                <option value={id} key={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {busy ? (
            <button
              className="action-secondary"
              onClick={() => {
                work.current?.abort();
                setMessage("Preparation cancelled.");
              }}
            >
              Cancel preparation
            </button>
          ) : (
            <button
              className="action-secondary"
              disabled={phrase.length > 500}
              onClick={prepare}
            >
              Prepare voice on this device
            </button>
          )}
          {phrase.length > 500 && (
            <p>Choose a reminder of 500 characters or fewer for this voice.</p>
          )}
        </>
      ) : (
        <p>
          The included voice is available here. A compatible WebGPU browser is
          needed to prepare another voice.
        </p>
      )}
      <p role="status">{message}</p>
    </details>
  );
}
