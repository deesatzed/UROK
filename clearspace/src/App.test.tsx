import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import App from "./App";

const speech = window.speechSynthesis as unknown as {
  cancel: ReturnType<typeof vi.fn>;
  speak: ReturnType<typeof vi.fn>;
};

afterEach(() => {
  window.speechSynthesis.cancel();
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe("App shell", () => {
  it("renders the working ClearSpace home screen", () => {
    render(<App />);

    expect(
      screen.getByRole("link", { name: /skip to main content/i }),
    ).toHaveAttribute("href", "#main-content");
    expect(
      screen.getByRole("main", { name: /home content/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /one steady step at a time/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start calming support/i }),
    ).toBeInTheDocument();
  });

  it("routes to secondary views and back home", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^practice$/i }));
    await waitFor(() =>
      expect(
        screen.getByRole("main", { name: /practice content/i }),
      ).toHaveFocus(),
    );
    expect(
      screen.getByRole("heading", { name: /practice when you feel ready/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/cognitive behavioral therapy/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back to home/i }));
    expect(
      screen.getByRole("heading", { name: /one steady step at a time/i }),
    ).toBeInTheDocument();
  });

  it("toggles low-stimulation mode", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = screen.getByRole("button", { name: /dim screen/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: /dim screen/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("walks through the SOS wizard and branches to breathing", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );

    expect(
      screen.getByRole("heading", { name: /feel one steady surface/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next step/i }));
    expect(
      screen.getByRole("heading", { name: /your reminder/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/this feeling is intense/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next step/i }));
    await user.click(screen.getByRole("button", { name: /next step/i }));

    expect(
      screen.getByRole("heading", { name: /what would help next/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /paced breathing/i }));
    expect(
      screen.getByRole("heading", { name: /breathe at your own pace/i }),
    ).toBeInTheDocument();
  });

  it("keeps active SOS focused by hiding shell navigation shortcuts", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole("navigation", { name: /main navigation/i }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );

    expect(
      screen.queryByRole("navigation", { name: /main navigation/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("complementary", { name: /primary navigation/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /open settings/i }),
    ).not.toBeInTheDocument();
  });

  it("lets the user switch from breathing to grounding when breathing feels uncomfortable", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /paced breathing/i }));
    expect(
      screen.getByRole("heading", { name: /breathe at your own pace/i }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /try grounding instead/i }),
    );

    expect(
      screen.getByRole("heading", { name: /name 5 things you can see/i }),
    ).toBeInTheDocument();
  });

  it("stores an optional post-calm check-in locally after a tool", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /paced breathing/i }));
    await user.click(screen.getByRole("button", { name: /^done$/i }));

    expect(
      screen.getByRole("heading", { name: /what changed/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /save check-in/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /a little calmer/i }),
    ).toHaveAttribute("aria-pressed", "false");
    await user.click(screen.getByRole("button", { name: /a little calmer/i }));
    await user.click(screen.getByRole("button", { name: /grounding helped/i }));
    await user.click(screen.getByRole("button", { name: /save check-in/i }));

    const storedCheckIns = window.localStorage.getItem(
      "clearspace:support-check-ins",
    );
    expect(storedCheckIns).toContain("a-little-calmer");
    expect(storedCheckIns).toContain("grounding-helped");
    expect(
      screen.getByText(/last check-in saved locally/i),
    ).toBeInTheDocument();
  });

  it("uses focus profile context to change suggested tool order without hiding SOS", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^settings$/i }));
    await user.click(
      screen.getByRole("button", { name: /breathing feels sensitive/i }),
    );
    await user.click(screen.getByRole("button", { name: /back to home/i }));

    expect(
      screen.getByRole("button", { name: /start calming support/i }),
    ).toBeInTheDocument();

    const supportAreas = screen.getByLabelText(/support areas/i);
    const supportButtons = within(supportAreas).getAllByRole("button");
    expect(supportButtons[0]).toHaveTextContent(/5-4-3-2-1 senses/i);

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /try a different exercise/i }),
    );

    const branchActions = screen.getByLabelText(/next support options/i);
    const branchButtons = within(branchActions).getAllByRole("button");
    expect(branchButtons[0]).toHaveTextContent(/5-4-3-2-1 grounding/i);
  });

  it("routes red-flag journal text to deterministic emergency guidance", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^journal$/i }));
    await user.type(
      screen.getByLabelText(/what may have triggered this/i),
      "I have chest pain and might faint",
    );
    await user.click(screen.getByRole("button", { name: /save note/i }));

    expect(
      screen.getByRole("heading", { name: /get urgent support now/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/emergency services/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/trigger: i have chest pain/i),
    ).not.toBeInTheDocument();
  });

  it("updates personalization settings and passes support contact into SOS", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^settings$/i }));

    await user.click(screen.getByText("My reminders"));
    await user.type(screen.getByLabelText(/add phrase/i), "I can pause.");
    await user.click(screen.getAllByRole("button", { name: /^add$/i })[0]!);
    expect(
      screen.getByRole("option", { name: "I can pause." }),
    ).toBeInTheDocument();

    await user.click(screen.getByText("My physical toolkit"));
    await user.click(screen.getByRole("button", { name: /need: sour candy/i }));
    expect(
      screen.getByRole("button", { name: /ready: sour candy/i }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.type(screen.getByLabelText(/^name$/i), "Alex");
    await user.type(screen.getByLabelText(/^phone$/i), "555-0100");
    await user.click(screen.getByRole("button", { name: /voice guide off/i }));
    expect(
      screen.getByRole("button", { name: /voice guide on/i }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector("iframe")).toBeNull();

    await user.click(screen.getByRole("button", { name: /back to home/i }));
    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );

    expect(screen.getByRole("link", { name: /call alex/i })).toHaveAttribute(
      "href",
      "tel:555-0100",
    );
  });

  it("uses enabled voice guide to read and stop scripted SOS guidance", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^settings$/i }));
    await user.click(screen.getByRole("button", { name: /voice guide off/i }));
    vi.clearAllMocks();

    await user.click(screen.getByRole("button", { name: /back to home/i }));
    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );

    await waitFor(() =>
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled(),
    );
    const players = vi.mocked(HTMLMediaElement.prototype.play).mock.contexts;
    const clip = players[players.length - 1] as HTMLAudioElement;
    expect(clip.src).toMatch(/voices\/surface\.mp3$/);
    const pauses = vi.mocked(HTMLMediaElement.prototype.pause).mock.calls
      .length;
    await user.click(screen.getByRole("button", { name: /mute guide/i }));
    expect(
      vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length,
    ).toBeGreaterThan(pauses);
  });

  it("does not read SOS guidance when voice guide is disabled", async () => {
    const user = userEvent.setup();
    render(<App />);

    vi.clearAllMocks();
    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );

    expect(speech.speak).not.toHaveBeenCalled();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: /mute guide/i }),
    ).not.toBeInTheDocument();
  });

  it("plays included clips even when browser speech synthesis is unavailable", async () => {
    const user = userEvent.setup();
    const originalSpeechSynthesis = window.speechSynthesis;

    Object.defineProperty(window, "speechSynthesis", {
      value: undefined,
      configurable: true,
    });

    try {
      render(<App />);
      await user.click(screen.getByRole("button", { name: /^settings$/i }));

      await user.click(screen.getByRole("button", { name: /back to home/i }));
      await user.click(
        screen.getByRole("button", { name: /start calming support/i }),
      );
      await user.click(screen.getByRole("button", { name: /listen/i }));
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      expect(document.querySelector("iframe")).toBeNull();
    } finally {
      Object.defineProperty(window, "speechSynthesis", {
        value: originalSpeechSynthesis,
        configurable: true,
      });
    }
  });

  it("stops active voice guidance when leaving the SOS view", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^settings$/i }));
    await user.click(screen.getByRole("button", { name: /voice guide off/i }));
    vi.clearAllMocks();

    await user.click(screen.getByRole("button", { name: /back to home/i }));
    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );

    await waitFor(() =>
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled(),
    );
    const cancelCount = vi.mocked(HTMLMediaElement.prototype.pause).mock.calls
      .length;

    await user.click(screen.getByRole("button", { name: /exit guide/i }));
    expect(
      vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length,
    ).toBeGreaterThan(cancelCount);
  });

  it("persists support contact settings across remounts", async () => {
    const user = userEvent.setup();
    const view = render(<App />);

    await user.click(screen.getByRole("button", { name: /^settings$/i }));
    await user.type(screen.getByLabelText(/^name$/i), "Morgan");
    await user.type(screen.getByLabelText(/^phone$/i), "555-0200");
    view.unmount();

    render(<App />);
    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );

    expect(screen.getByRole("link", { name: /call morgan/i })).toHaveAttribute(
      "href",
      "tel:555-0200",
    );
  });

  it("shows bounded safety guidance in practice and settings", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^practice$/i }));
    expect(
      screen.getAllByText(/new, severe, or unusual/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(/for immediate danger/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back to home/i }));
    await user.click(screen.getByRole("button", { name: /^settings$/i }));
    expect(
      screen.getByText(/cannot tell what is causing them/i),
    ).toBeInTheDocument();
  });

  it("saves an optional journal note locally", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/what may have triggered this/i),
      "Crowded train",
    );
    await user.type(screen.getByLabelText(/what helped/i), "Grounding");
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    expect(screen.getByText(/crowded train/i)).toBeInTheDocument();
    expect(screen.getAllByText(/grounding/i).length).toBeGreaterThan(0);
  });

  it("exports and deletes journal notes locally", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^journal$/i }));
    await user.type(
      screen.getByLabelText(/what may have triggered this/i),
      "Crowded train",
    );
    await user.type(screen.getByLabelText(/what helped/i), "Grounding");
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    const exportLink = screen.getByRole("link", {
      name: /download journal json/i,
    });
    expect(exportLink).toHaveAttribute("download", "clearspace-journal.json");
    expect(decodeURIComponent(exportLink.getAttribute("href") ?? "")).toContain(
      "Crowded train",
    );

    await user.click(screen.getByRole("button", { name: /delete note/i }));
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /download journal json/i }),
    ).not.toBeInTheDocument();
  });

  it("requires a second click before deleting all journal notes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^journal$/i }));
    await user.type(screen.getByLabelText(/what helped/i), "Breathing");
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    await user.click(screen.getByRole("button", { name: /delete all notes/i }));
    expect(screen.getByText(/breathing/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /confirm delete all/i }),
    );
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it("can skip journaling without creating a note", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^journal$/i }));
    await user.click(screen.getByRole("button", { name: /^skip$/i }));

    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it("opens offline Spark Joy prompts without the SOS path", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /spark joy/i }));

    expect(
      screen.getByRole("heading", { name: /color hunt/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /another/i }));
    expect(
      screen.getByRole("heading", { name: /tiny reset/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^done$/i }));
    expect(
      screen.getByRole("button", { name: /start calming support/i }),
    ).toBeInTheDocument();
  });
});

describe("Choices during support", () => {
  const click = (name: RegExp) =>
    userEvent.click(screen.getByRole("button", { name }));
  it("opens urgent help from the first cue, returns focus, and keeps the cue in place", async () => {
    render(<App />);
    await click(/start calming support/i);
    const opener = screen.getByRole("button", { name: /urgent help/i });
    await userEvent.click(opener);
    const help = screen.getByRole("dialog", { name: /get urgent help/i });
    expect(within(help).getByRole("heading")).toHaveFocus();
    expect(
      within(help).getByRole("link", { name: /call 911 in the U.S./i }),
    ).toHaveAttribute("href", "tel:911");
    await click(/go back/i);
    expect(opener).toHaveFocus();
    expect(
      screen.getByRole("heading", { name: /feel one steady surface/i }),
    ).toBeVisible();
  });

  it("allows an accessible opening and selected personal reminder to survive a reload", async () => {
    const view = render(<App />);
    await click(/set up my guide/i);
    await userEvent.selectOptions(screen.getByLabelText("First cue"), "look");
    await userEvent.selectOptions(
      screen.getByLabelText("Personal reminder"),
      "I can take the next small step.",
    );
    view.unmount();
    render(<App />);
    await click(/start calming support/i);
    expect(
      screen.getByRole("heading", { name: /find one color nearby/i }),
    ).toBeVisible();
    await click(/next step/i);
    expect(screen.getByText("I can take the next small step.")).toBeVisible();
  });

  it("allows grounding to finish without tallying, and saves worsening without attributing benefit", async () => {
    render(<App />);
    await click(/start calming support/i);
    await click(/try a different exercise/i);
    await click(/5-4-3-2-1 grounding/i);
    await click(/next sense/i);
    expect(
      screen.getByRole("heading", { name: /name 4 things/i }),
    ).toHaveFocus();
    await click(/done for now/i);
    await click(/more intense/i);
    await click(/save check-in/i);
    const [entry] = JSON.parse(
      localStorage.getItem("clearspace:support-check-ins")!,
    );
    expect(entry.shift).toBe("more-intense");
    expect(entry).not.toHaveProperty("helped");
  });

  it("keeps a session mute across tools after urgent help interrupts audio", async () => {
    render(<App />);
    await click(/start calming support/i);
    await click(/listen/i);
    await click(/urgent help/i);
    await click(/go back/i);
    vi.clearAllMocks();
    await click(/try a different exercise/i);
    await click(/5-4-3-2-1 grounding/i);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /listen/i })).toBeVisible();
  });
});
