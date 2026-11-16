import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { SpeechGuideControls } from "../hooks/useSpeechGuide";
export function VoiceControl({
  guide,
  text,
}: {
  guide: SpeechGuideControls;
  text: string;
}) {
  if (!guide.supported || !guide.setEnabled) return null;
  return (
    <span className="voice-control">
      <button
        className="quiet-control"
        type="button"
        aria-pressed={guide.enabled}
        onClick={() => {
          if (guide.enabled) guide.stop();
          else guide.read(text);
          guide.setEnabled?.(!guide.enabled);
        }}
      >
        {guide.enabled ? <VolumeX size={16} /> : <Volume2 size={16} />}
        {guide.enabled ? "Mute guide" : "Listen"}
      </button>
      {guide.enabled && !guide.isSpeaking && (
        <button
          type="button"
          className="circle-control"
          aria-label={guide.status === "blocked" ? "Play cue" : "Repeat cue"}
          onClick={() => guide.read(text)}
        >
          {guide.status === "blocked" ? (
            <Play size={16} />
          ) : (
            <RotateCcw size={16} />
          )}
        </button>
      )}
      {guide.enabled && guide.status === "blocked" && (
        <small role="status">Tap play to hear this cue.</small>
      )}
      {guide.enabled && guide.status === "unsupported" && (
        <small role="status">
          Audio unavailable for this cue. You can keep reading.
        </small>
      )}
    </span>
  );
}
