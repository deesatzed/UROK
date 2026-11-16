import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { guideAudio, type VoiceStyle } from "../data/guide";
import {
  stopSpeech,
  type SpeechStatus,
} from "../services/speechSynthesis";
import type { PreparedPack } from "../services/voicePack";

function releaseAudio(audio: HTMLAudioElement) {
  audio.onended = null;
  audio.onerror = null;
  audio.onplaying = null;
  audio.pause();
  // Abort pending play/decode work as well as playback that has already started.
  audio.removeAttribute("src");
  audio.load();
}

let audioOwner: (() => boolean) | undefined;

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
  voiceStyle: VoiceStyle = "gentle",
): SpeechGuideControls {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const active = useRef<{
    audio?: HTMLAudioElement;
    url?: string;
    text?: string;
    paused?: boolean;
    start?: () => void;
  }>({});
  const savedPack = useRef(pack);
  const savedStyle = useRef(voiceStyle);
  const pausedByUser = useRef(false);
  const channel = useRef<BroadcastChannel | null>(null);
  // Loading a saved pack must not change read's identity and replay the current cue.
  useLayoutEffect(() => {
    savedPack.current = pack;
    savedStyle.current = voiceStyle;
  }, [pack, voiceStyle]);
  const hasAudio = typeof Audio !== "undefined";
  const supported = hasAudio;

  const stop = useCallback(() => {
    const old = active.current;
    active.current = {};
    if (audioOwner === stop) audioOwner = undefined;
    if (old.audio) releaseAudio(old.audio);
    if (old.url) URL.revokeObjectURL(old.url);
    stopSpeech();
    setStatus("idle");
    return true;
  }, []);
  useEffect(() => {
    if (!enabled) {
      pausedByUser.current = false;
      stop();
    }
  }, [enabled, stop]);
  useEffect(() => {
    window.addEventListener("pagehide", stop);
    let peer: BroadcastChannel | undefined;
    try {
      if (typeof window.BroadcastChannel !== "undefined") {
        peer = new window.BroadcastChannel("clearspace-guide-audio");
        peer.onmessage = (event) => {
          if (event.data === "playing") stop();
        };
        channel.current = peer;
      }
    } catch {
      // Restricted browser storage must not prevent local audio playback.
    }
    return () => {
      window.removeEventListener("pagehide", stop);
      channel.current = null;
      peer?.close();
    };
  }, [stop]);
  useEffect(
    () => () => {
      stop();
    },
    [stop],
  );
  const read = useCallback(
    (value: string) => {
      const requested = value.trim();
      if (!supported || !requested) return false;
      const { text, id } = guideAudio(requested, savedStyle.current);
      if (active.current.text === text) return true;
      stop();
      audioOwner?.();
      audioOwner = stop;
      channel.current?.postMessage("playing");
      const slot = active.current;
      slot.text = text;
      slot.paused = pausedByUser.current;
      const live = () => active.current === slot;
      const releaseUrl = () => {
        if (slot.url) URL.revokeObjectURL(slot.url);
        slot.url = undefined;
      };
      const finish = (next: SpeechStatus = "idle") => {
        if (!live()) return;
        if (slot.audio) releaseAudio(slot.audio);
        releaseUrl();
        active.current = {};
        if (audioOwner === stop) audioOwner = undefined;
        setStatus(next);
      };
      const play = (src: string, next: () => void) => {
        if (!live()) return;
        const audio = new Audio(src);
        slot.audio = audio;
        let failed = false;
        const fallback = (error?: unknown) => {
          if (failed || !live() || slot.audio !== audio) return;
          const name = error instanceof DOMException ? error.name : "";
          if (name === "AbortError" && slot.paused) return;
          failed = true;
          releaseAudio(audio);
          slot.audio = undefined;
          releaseUrl();
          // Autoplay restrictions affect every voice. Ask for a tap instead.
          if (name === "NotAllowedError") finish("blocked");
          else next();
        };
        const started = () => {
          if (!live() || slot.audio !== audio) releaseAudio(audio);
          else if (slot.paused) audio.pause();
        };
        audio.onended = () => {
          if (live() && slot.audio === audio) finish();
        };
        audio.onerror = fallback;
        audio.onplaying = started;
        slot.start = () => {
          try {
            void Promise.resolve(audio.play()).then(started, fallback);
          } catch (error) {
            fallback(error);
          }
        };
        if (!slot.paused) slot.start();
      };
      setStatus(slot.paused ? "paused" : "speaking");
      const standard = () => {
        if (id && hasAudio) {
          play(import.meta.env.BASE_URL + "voices/" + id + ".mp3", () =>
            finish("unsupported"),
          );
        } else finish("unsupported");
      };
      const prepared = savedPack.current?.clips.find((c) => c.text === text);
      if (prepared && hasAudio) {
        slot.url = URL.createObjectURL(prepared.audio);
        play(slot.url, standard);
      } else standard();
      return Boolean(prepared || id);
    },
    [supported, stop, hasAudio],
  );
  const pause = useCallback(() => {
    const slot = active.current;
    if (!slot.audio) return false;
    pausedByUser.current = true;
    slot.paused = true;
    slot.audio.pause();
    setStatus("paused");
    return true;
  }, []);
  const resume = useCallback(() => {
    const slot = active.current;
    if (!slot.audio || !slot.start || !slot.paused) return false;
    pausedByUser.current = false;
    slot.paused = false;
    setStatus("speaking");
    slot.start();
    return true;
  }, []);
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
