import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { spokenCue } from "../data/guide";
import type { PreparedPack } from "../services/voicePack";
import { useSpeechGuide } from "./useSpeechGuide";

class TestAudio {
  static instances: TestAudio[] = [];
  static nextPlay: Promise<void> | undefined;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onplaying: (() => void) | null = null;
  play = vi.fn(() => this.pending ?? Promise.resolve());
  pause = vi.fn();
  load = vi.fn();
  removeAttribute = vi.fn((name: string) => {
    if (name === "src") this.src = "";
  });
  private pending = TestAudio.nextPlay;
  constructor(public src: string) {
    TestAudio.nextPlay = undefined;
    TestAudio.instances.push(this);
  }
}

const cue = spokenCue("surface");
const pack: PreparedPack = {
  voice: "default_b78b28baf5c31a1d",
  clips: [{ text: cue, audio: new Blob([new Uint8Array(100)]) }],
};

function setup(initialPack: PreparedPack | null = null) {
  return renderHook(
    ({ enabled, savedPack }) => useSpeechGuide(enabled, savedPack, vi.fn()),
    { initialProps: { enabled: true, savedPack: initialPack } },
  );
}

describe("guide audio playback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    TestAudio.instances = [];
    TestAudio.nextPlay = undefined;
    vi.stubGlobal("Audio", TestAudio);
    vi.stubGlobal(
      "URL",
      Object.assign(class extends URL {}, {
        createObjectURL: vi.fn(() => "blob:prepared-cue"),
        revokeObjectURL: vi.fn(),
      }),
    );
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("plays a recorded cue once and fully releases it on stop", async () => {
    const { result } = setup();
    await act(async () => {
      result.current.read(cue);
      result.current.read(cue);
    });
    expect(TestAudio.instances).toHaveLength(1);
    const audio = TestAudio.instances[0];
    expect(audio.src).toMatch(/voices\/surface\.mp3$/);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    act(() => { result.current.stop(); });
    expect(audio.pause).toHaveBeenCalled();
    expect(audio.src).toBe("");
    expect(audio.load).toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("releases a failed prepared player before starting the included recording", async () => {
    const { result } = setup(pack);
    await act(async () => { result.current.read(cue); });
    const prepared = TestAudio.instances[0];
    const error = prepared.onerror;
    await act(async () => { error?.(); });
    expect(prepared.pause).toHaveBeenCalled();
    expect(prepared.src).toBe("");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:prepared-cue");
    expect(TestAudio.instances).toHaveLength(2);
    expect(TestAudio.instances[1].src).toMatch(/voices\/surface\.mp3$/);
    await act(async () => { error?.(); });
    expect(TestAudio.instances).toHaveLength(2);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it("does not replace a missing recording with an arbitrary computer voice", async () => {
    const { result } = setup();
    await act(async () => { result.current.read(cue); });
    await act(async () => { TestAudio.instances[0].onerror?.(); });
    expect(result.current.status).toBe("unsupported");
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it("leaves a custom reminder as text until its own audio is prepared", async () => {
    const { result } = setup();
    await act(async () => { result.current.read("My private reminder."); });
    expect(result.current.status).toBe("unsupported");
    expect(TestAudio.instances).toHaveLength(0);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it("offers retry when autoplay is blocked, without starting another voice", async () => {
    TestAudio.nextPlay = Promise.reject(new DOMException("Tap to play", "NotAllowedError"));
    const { result } = setup(pack);
    await act(async () => { result.current.read(cue); });
    expect(result.current.status).toBe("blocked");
    expect(TestAudio.instances).toHaveLength(1);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    await act(async () => { result.current.read(cue); });
    expect(result.current.status).toBe("speaking");
    expect(TestAudio.instances).toHaveLength(2);
  });

  it("keeps a cancelled, late-starting player silent", async () => {
    let finishPlay!: () => void;
    TestAudio.nextPlay = new Promise<void>((resolve) => { finishPlay = resolve; });
    const { result } = setup();
    act(() => { result.current.read(cue); });
    const audio = TestAudio.instances[0];
    act(() => { result.current.stop(); });
    const pauses = audio.pause.mock.calls.length;
    await act(async () => { finishPlay(); });
    expect(audio.pause.mock.calls.length).toBeGreaterThan(pauses);
    expect(audio.src).toBe("");
    expect(result.current.status).toBe("idle");
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it("keeps read stable when a saved voice finishes loading during playback", async () => {
    const { result, rerender } = setup();
    await act(async () => { result.current.read(cue); });
    const read = result.current.read;
    rerender({ enabled: true, savedPack: pack });
    expect(result.current.read).toBe(read);
    await act(async () => { result.current.read(cue); });
    expect(TestAudio.instances).toHaveLength(1);
    act(() => { result.current.stop(); });
    await act(async () => { result.current.read(cue); });
    expect(TestAudio.instances[1].src).toBe("blob:prepared-cue");
  });

  it("stops playback when muted and ignores old error callbacks", async () => {
    const { result, rerender } = setup();
    await act(async () => { result.current.read(cue); });
    const audio = TestAudio.instances[0];
    const error = audio.onerror;
    rerender({ enabled: false, savedPack: null });
    expect(audio.pause).toHaveBeenCalled();
    expect(audio.src).toBe("");
    await act(async () => { error?.(); });
    expect(TestAudio.instances).toHaveLength(1);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("ignores a delayed error from the previous cue after moving on", async () => {
    let rejectPlay!: (error: Error) => void;
    TestAudio.nextPlay = new Promise<void>((_, reject) => { rejectPlay = reject; });
    const { result } = setup(pack);
    act(() => { result.current.read(cue); });
    const previous = TestAudio.instances[0];
    await act(async () => { result.current.read(spokenCue("ease")); });
    await act(async () => { rejectPlay(new DOMException("Old request", "NotSupportedError")); });
    expect(TestAudio.instances).toHaveLength(2);
    expect(previous.src).toBe("");
    expect(TestAudio.instances[1].src).toMatch(/voices\/ease\.mp3$/);
    expect(result.current.status).toBe("speaking");
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it("keeps a pending play paused and resumes the same player", async () => {
    let finishPlay!: () => void;
    TestAudio.nextPlay = new Promise<void>((resolve) => { finishPlay = resolve; });
    const { result } = setup();
    act(() => { result.current.read(cue); result.current.pause(); });
    await act(async () => { finishPlay(); });
    expect(result.current.status).toBe("paused");
    expect(TestAudio.instances[0].pause).toHaveBeenCalled();
    await act(async () => { result.current.resume(); });
    expect(TestAudio.instances).toHaveLength(1);
    expect(result.current.status).toBe("speaking");
    expect(TestAudio.instances[0].play).toHaveBeenCalledTimes(2);
  });

  it("allows only one guide instance to speak at a time", async () => {
    const first = setup();
    const second = setup();
    await act(async () => { first.result.current.read(cue); });
    await act(async () => { second.result.current.read(spokenCue("ease")); });
    expect(TestAudio.instances[0].src).toBe("");
    expect(first.result.current.status).toBe("idle");
    expect(second.result.current.status).toBe("speaking");
    first.unmount();
    expect(TestAudio.instances[1].src).toMatch(/voices\/ease\.mp3$/);
  });

  it("stops for another tab without sharing cue text", async () => {
    const postMessage = vi.fn();
    const close = vi.fn();
    let peer!: { onmessage: ((event: { data: string }) => void) | null };
    vi.stubGlobal("BroadcastChannel", class {
      onmessage = null;
      postMessage = postMessage;
      close = close;
      constructor() { peer = this; }
    });
    const { result, unmount } = setup();
    await act(async () => { result.current.read(cue); });
    expect(postMessage).toHaveBeenCalledWith("playing");
    await act(async () => { peer.onmessage?.({ data: "playing" }); });
    expect(TestAudio.instances[0].src).toBe("");
    expect(result.current.status).toBe("idle");
    unmount();
    expect(close).toHaveBeenCalled();
  });
});
