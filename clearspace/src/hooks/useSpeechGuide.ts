import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  isSpeechSynthesisSupported,
  pauseSpeech,
  resumeSpeech,
  type SpeechStatus,
  speakText,
  stopSpeech,
} from "../services/speechSynthesis";

export type SpeechGuideControls = {
  enabled: boolean;
  isPaused: boolean;
  isSpeaking: boolean;
  pause: () => boolean;
  read: (text: string) => boolean;
  resume: () => boolean;
  status: SpeechStatus;
  stop: () => boolean;
  supported: boolean;
};

export const inactiveSpeechGuide: SpeechGuideControls = {
  enabled: false,
  isPaused: false,
  isSpeaking: false,
  pause: () => false,
  read: () => false,
  resume: () => false,
  status: "idle",
  stop: () => false,
  supported: false,
};

export function useSpeechGuide(enabled: boolean): SpeechGuideControls {
  const supported = isSpeechSynthesisSupported();
  const mountedRef = useRef(true);
  const [status, setStatus] = useState<SpeechStatus>(
    supported ? "idle" : "unsupported",
  );

  const safeSetStatus = useCallback((nextStatus: SpeechStatus) => {
    if (mountedRef.current) {
      setStatus(nextStatus);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    if (!supported) {
      safeSetStatus("unsupported");
      return;
    }

    if (!enabled) {
      stopSpeech();
      safeSetStatus("idle");
    }
  }, [enabled, safeSetStatus, supported]);

  const read = useCallback(
    (text: string) => {
      if (!enabled || !supported) return false;

      safeSetStatus("speaking");
      const didSpeak = speakText(text, {
        onEnd: () => safeSetStatus("idle"),
        onError: () => safeSetStatus("idle"),
        onStart: () => safeSetStatus("speaking"),
      });

      if (!didSpeak) {
        safeSetStatus(supported ? "idle" : "unsupported");
      }

      return didSpeak;
    },
    [enabled, safeSetStatus, supported],
  );

  const stop = useCallback(() => {
    const didStop = stopSpeech();
    safeSetStatus(supported ? "idle" : "unsupported");
    return didStop;
  }, [safeSetStatus, supported]);

  const pause = useCallback(() => {
    const didPause = pauseSpeech();
    if (didPause) {
      safeSetStatus("paused");
    }
    return didPause;
  }, [safeSetStatus]);

  const resume = useCallback(() => {
    const didResume = resumeSpeech();
    if (didResume) {
      safeSetStatus("speaking");
    }
    return didResume;
  }, [safeSetStatus]);

  return useMemo(
    () => ({
      enabled,
      isPaused: status === "paused",
      isSpeaking: status === "speaking",
      pause,
      read,
      resume,
      status,
      stop,
      supported,
    }),
    [enabled, pause, read, resume, status, stop, supported],
  );
}
