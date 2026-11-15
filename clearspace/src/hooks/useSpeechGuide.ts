import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bundledClips } from "../data/guide";
import {
  isSpeechSynthesisSupported,
  pauseSpeech,
  resumeSpeech,
  speakText,
  stopSpeech,
  type SpeechStatus,
} from "../services/speechSynthesis";
import type { PreparedPack } from "../services/voicePack";

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
  setEnabled?: (v: boolean) => void;
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

export function useSpeechGuide(
  enabled: boolean,
  pack: PreparedPack | null,
  setEnabled: (v: boolean) => void,
): SpeechGuideControls {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const active = useRef<{
    audio?: HTMLAudioElement;
    url?: string;
    text?: string;
  }>({});
  const hasAudio = typeof Audio !== "undefined";
  const supported = hasAudio || isSpeechSynthesisSupported();

  const stop = useCallback(() => {
    const old = active.current;
    active.current = {};
    if (old.audio) {
      old.audio.onended = null;
      old.audio.onerror = null;
      old.audio.pause();
    }
    if (old.url) URL.revokeObjectURL(old.url);
    stopSpeech();
    setStatus("idle");
    return true;
  }, []);
  useEffect(
    () => () => {
      stop();
    },
    [stop],
  );
  const read = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return false;
      if (active.current.text === text) return true;
      stop();
      const slot = active.current;
      slot.text = text;
      const live = () => active.current === slot;
      const ended = () => {
        if (!live()) return;
        if (slot.url) URL.revokeObjectURL(slot.url);
        active.current = {};
        setStatus("idle");
      };
      const deviceVoice = () => {
        if (!live()) return;
        const unavailable = () => {
          if (!live()) return;
          ended();
          setStatus("unsupported");
        };
        if (!speakText(text, { onEnd: ended, onError: unavailable }))
          unavailable();
      };
      const play = (src: string, next: () => void) => {
        if (!live()) return;
        const audio = new Audio(src);
        slot.audio = audio;
        let failed = false;
        const fallback = () => {
          if (failed || !live() || slot.audio !== audio) return;
          failed = true;
          audio.onended = null;
          audio.onerror = null;
          slot.audio = undefined;
          next();
        };
        audio.onended = ended;
        audio.onerror = fallback;
        try {
          void audio.play().catch(fallback);
        } catch {
          fallback();
        }
      };
      setStatus("speaking");
      const id = bundledClips.get(text);
      const standard = () => {
        if (id && hasAudio)
          play(import.meta.env.BASE_URL + "voices/" + id + ".mp3", deviceVoice);
        else deviceVoice();
      };
      const prepared = pack?.clips.find((c) => c.text === text);
      if (prepared && hasAudio) {
        slot.url = URL.createObjectURL(prepared.audio);
        play(slot.url, standard);
      } else standard();
      return true;
    },
    [supported, stop, hasAudio, pack],
  );
  const pause = useCallback(() => {
    if (active.current.audio) active.current.audio.pause();
    else if (!pauseSpeech()) return false;
    setStatus("paused");
    return true;
  }, []);
  const resume = useCallback(() => {
    if (active.current.audio) void active.current.audio.play().catch(stop);
    else if (!resumeSpeech()) return false;
    setStatus("speaking");
    return true;
  }, [stop]);
  return useMemo(
    () => ({
      enabled,
      supported,
      status,
      isSpeaking: status === "speaking",
      isPaused: status === "paused",
      read,
      stop,
      pause,
      resume,
      setEnabled,
    }),
    [enabled, supported, status, read, stop, pause, resume, setEnabled],
  );
}
