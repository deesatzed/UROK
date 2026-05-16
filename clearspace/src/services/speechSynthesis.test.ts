import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isSpeechSynthesisSupported,
  pauseSpeech,
  resumeSpeech,
  speakText,
  stopSpeech,
} from "./speechSynthesis";

const speech = window.speechSynthesis as unknown as {
  cancel: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  speak: ReturnType<typeof vi.fn>;
};

describe("speechSynthesis service", () => {
  afterEach(() => {
    window.speechSynthesis.cancel();
    vi.clearAllMocks();
  });

  it("detects browser speech synthesis support", () => {
    expect(isSpeechSynthesisSupported()).toBe(true);
  });

  it("falls back when browser speech synthesis is unavailable", () => {
    const originalSpeechSynthesis = window.speechSynthesis;

    Object.defineProperty(window, "speechSynthesis", {
      value: undefined,
      configurable: true,
    });

    try {
      expect(isSpeechSynthesisSupported()).toBe(false);
      expect(speakText("Breathe in.")).toBe(false);
      expect(pauseSpeech()).toBe(false);
      expect(resumeSpeech()).toBe(false);
      expect(stopSpeech()).toBe(false);
    } finally {
      Object.defineProperty(window, "speechSynthesis", {
        value: originalSpeechSynthesis,
        configurable: true,
      });
    }
  });

  it("speaks trimmed text and invokes lifecycle callbacks", () => {
    const onEnd = vi.fn();
    const onStart = vi.fn();

    expect(speakText("  Breathe in.  ", { onEnd, onStart })).toBe(true);

    expect(speech.cancel).toHaveBeenCalled();
    expect(speech.speak).toHaveBeenCalledTimes(1);
    const utterance = speech.speak.mock.calls[0]?.[0] as SpeechSynthesisUtterance;
    expect(utterance.text).toBe("Breathe in.");
    expect(utterance.rate).toBe(0.92);
    expect(onStart).toHaveBeenCalled();

    utterance.onend?.(new Event("end") as SpeechSynthesisEvent);
    expect(onEnd).toHaveBeenCalled();
  });

  it("does not speak blank text", () => {
    expect(speakText("  ")).toBe(false);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("can pause, resume, and stop speech", () => {
    speakText("Breathe out.");

    expect(pauseSpeech()).toBe(true);
    expect(speech.pause).toHaveBeenCalled();

    expect(resumeSpeech()).toBe(true);
    expect(speech.resume).toHaveBeenCalled();

    expect(stopSpeech()).toBe(true);
    expect(speech.cancel).toHaveBeenCalled();
  });
});
