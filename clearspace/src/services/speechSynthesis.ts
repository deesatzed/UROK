export type SpeechStatus = "idle" | "speaking" | "paused" | "unsupported";

type SpeechSynthesisUtteranceConstructor = new (
  text: string,
) => SpeechSynthesisUtterance;

type SpeechApi = {
  synthesis: SpeechSynthesis | null;
  Utterance: SpeechSynthesisUtteranceConstructor | null;
};

type SpeakOptions = {
  onEnd?: () => void;
  onError?: () => void;
  onStart?: () => void;
  pitch?: number;
  rate?: number;
  volume?: number;
};

export function getSpeechApi(): SpeechApi {
  if (typeof window === "undefined") {
    return { synthesis: null, Utterance: null };
  }

  const Utterance =
    typeof window.SpeechSynthesisUtterance === "undefined"
      ? null
      : window.SpeechSynthesisUtterance;

  return {
    synthesis: window.speechSynthesis ?? null,
    Utterance,
  };
}

export function isSpeechSynthesisSupported(api = getSpeechApi()) {
  return Boolean(api.synthesis && api.Utterance);
}

export function speakText(text: string, options: SpeakOptions = {}) {
  const api = getSpeechApi();
  const trimmedText = text.trim();

  if (!trimmedText || !api.synthesis || !api.Utterance) {
    return false;
  }

  const utterance = new api.Utterance(trimmedText);
  utterance.pitch = options.pitch ?? 1;
  utterance.rate = options.rate ?? 0.92;
  utterance.volume = options.volume ?? 1;
  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = () => options.onError?.();

  api.synthesis.cancel();
  api.synthesis.speak(utterance);

  return true;
}

export function stopSpeech() {
  const { synthesis } = getSpeechApi();
  if (!synthesis) return false;

  synthesis.cancel();
  return true;
}

export function pauseSpeech() {
  const { synthesis } = getSpeechApi();
  if (!synthesis || !synthesis.speaking) return false;

  synthesis.pause();
  return true;
}

export function resumeSpeech() {
  const { synthesis } = getSpeechApi();
  if (!synthesis || !synthesis.paused) return false;

  synthesis.resume();
  return true;
}
