import { act, render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SpeechGuideControls } from "../hooks/useSpeechGuide";
import { BreathingTool } from "./BreathingTool";

function createSpeechGuide(
  overrides: Partial<SpeechGuideControls> = {},
): SpeechGuideControls {
  return {
    enabled: true,
    isPaused: false,
    isSpeaking: false,
    pause: vi.fn(() => false),
    read: vi.fn(() => true),
    resume: vi.fn(() => false),
    status: "idle",
    stop: vi.fn(() => true),
    supported: true,
    ...overrides,
  };
}

describe("BreathingTool", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts, ticks, pauses, and resets", async () => {
    render(<BreathingTool onDone={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /^start$/i }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole("button", { name: /pause breathing timer/i })).toHaveTextContent(
      "3",
    );

    fireEvent.click(screen.getByRole("button", { name: /^pause$/i }));
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole("button", { name: /start breathing timer/i })).toHaveTextContent(
      "3",
    );

    fireEvent.click(screen.getByRole("button", { name: /^reset$/i }));
    expect(screen.getByRole("button", { name: /start breathing timer/i })).toHaveTextContent(
      "4",
    );
  });

  it("cleans up its interval on unmount", () => {
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    const { unmount } = render(<BreathingTool onDone={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /^start$/i }));
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it("reads and stops scripted breathing cues when voice guide is enabled", () => {
    const speechGuide = createSpeechGuide();
    render(<BreathingTool onDone={vi.fn()} speechGuide={speechGuide} />);

    const initialStopCount = vi.mocked(speechGuide.stop).mock.calls.length;
    fireEvent.click(screen.getByRole("button", { name: /^start$/i }));

    expect(speechGuide.read).toHaveBeenCalledWith("Breathe in gently for four.");

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(speechGuide.read).toHaveBeenLastCalledWith(
      "Breathe out slowly for six.",
    );

    fireEvent.click(screen.getByRole("button", { name: /^reset$/i }));
    expect(vi.mocked(speechGuide.stop).mock.calls.length).toBeGreaterThan(
      initialStopCount,
    );
  });
});
