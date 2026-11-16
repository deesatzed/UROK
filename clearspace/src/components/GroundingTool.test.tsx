import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import type { SpeechGuideControls } from "../hooks/useSpeechGuide";
import { GroundingTool } from "./GroundingTool";

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

describe("GroundingTool", () => {
  it("advances when the optional tally reaches the current number", async () => {
    const user = userEvent.setup();
    render(<GroundingTool onDone={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: /something you can see/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByText("Count with taps"));
    await user.click(screen.getByRole("button", { name: /item 1/i }));
    expect(
      screen.getByRole("heading", { name: /something you can see/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /item 2/i }));
    await user.click(screen.getByRole("button", { name: /item 3/i }));
    await user.click(screen.getByRole("button", { name: /item 4/i }));
    await user.click(screen.getByRole("button", { name: /item 5/i }));

    expect(
      screen.getByRole("heading", { name: /something you can touch/i }),
    ).toBeInTheDocument();
  });

  it("reads scripted grounding guidance and stops when finished", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    const speechGuide = createSpeechGuide();

    render(<GroundingTool onDone={onDone} speechGuide={speechGuide} />);

    expect(speechGuide.read).toHaveBeenCalledWith(
      expect.stringMatching(/Something you can see/i),
    );

    await user.click(screen.getByText("Count with taps"));
    await user.click(screen.getByRole("button", { name: /item 1/i }));
    await user.click(screen.getByRole("button", { name: /item 2/i }));
    await user.click(screen.getByRole("button", { name: /item 3/i }));
    await user.click(screen.getByRole("button", { name: /item 4/i }));
    await user.click(screen.getByRole("button", { name: /item 5/i }));

    expect(speechGuide.read).toHaveBeenLastCalledWith(
      expect.stringMatching(/Something you can touch/i),
    );

    const stopCount = vi.mocked(speechGuide.stop).mock.calls.length;
    await user.click(screen.getByRole("button", { name: /done for now/i }));

    expect(vi.mocked(speechGuide.stop).mock.calls.length).toBeGreaterThan(
      stopCount,
    );
    expect(onDone).toHaveBeenCalled();
  });
});
