import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

if (typeof window !== "undefined" && !window.localStorage) {
  Object.defineProperty(window, "localStorage", {
    value: new MemoryStorage(),
    configurable: true,
  });
}

class MockSpeechSynthesisUtterance {
  lang = "";
  onend: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onstart: ((event: Event) => void) | null = null;
  pitch = 1;
  rate = 1;
  volume = 1;

  constructor(public text: string) {}
}

const speechSynthesisMock = {
  getVoices: vi.fn(() => [
    { lang: "en-US", localService: true, name: "Local English" },
  ]),
  cancel: vi.fn(() => {
    speechSynthesisMock.speaking = false;
    speechSynthesisMock.paused = false;
  }),
  pause: vi.fn(() => {
    speechSynthesisMock.paused = true;
  }),
  paused: false,
  resume: vi.fn(() => {
    speechSynthesisMock.paused = false;
    speechSynthesisMock.speaking = true;
  }),
  speak: vi.fn((utterance: MockSpeechSynthesisUtterance) => {
    speechSynthesisMock.speaking = true;
    speechSynthesisMock.paused = false;
    utterance.onstart?.(new Event("start"));
  }),
  speaking: false,
};

Object.defineProperty(window, "SpeechSynthesisUtterance", {
  value: MockSpeechSynthesisUtterance,
  configurable: true,
});

Object.defineProperty(window, "speechSynthesis", {
  value: speechSynthesisMock,
  configurable: true,
});

Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  configurable: true,
});
Object.defineProperty(HTMLMediaElement.prototype, "play", {
  value: vi.fn().mockResolvedValue(undefined),
  configurable: true,
});
Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  value: vi.fn(),
  configurable: true,
});
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
}

beforeEach(() => {
  history.replaceState(null, "", "/");
});
