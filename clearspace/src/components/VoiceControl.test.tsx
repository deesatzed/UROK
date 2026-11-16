import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { inactiveSpeechGuide } from "../hooks/useSpeechGuide";
import { VoiceControl } from "./VoiceControl";

describe("voice controls", () => {
  it("pauses narration without restarting it or muting the guide", () => {
    const guide = {
      ...inactiveSpeechGuide, enabled: true, supported: true,
      status: "speaking" as const, isSpeaking: true,
      pause: vi.fn(() => true), read: vi.fn(() => true), setEnabled: vi.fn(),
    };
    render(<VoiceControl guide={guide} text="My cue." />);
    fireEvent.click(screen.getByRole("button", { name: "Pause voice" }));
    expect(guide.pause).toHaveBeenCalledOnce();
    expect(guide.read).not.toHaveBeenCalled();
    expect(guide.setEnabled).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Repeat cue" })).not.toBeInTheDocument();
  });

  it("resumes a paused cue and keeps mute available", () => {
    const guide = {
      ...inactiveSpeechGuide, enabled: true, supported: true,
      status: "paused" as const, isPaused: true,
      resume: vi.fn(() => true), stop: vi.fn(() => true), setEnabled: vi.fn(),
    };
    render(<VoiceControl guide={guide} text="My cue." />);
    fireEvent.click(screen.getByRole("button", { name: "Resume voice" }));
    expect(guide.resume).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Mute guide" }));
    expect(guide.stop).toHaveBeenCalledOnce();
    expect(guide.setEnabled).toHaveBeenCalledWith(false);
  });
});
