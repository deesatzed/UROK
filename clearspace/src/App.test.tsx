import { render, screen, waitFor } from "@testing-library/react";
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
  it("renders the provisional ClearSpace home screen", () => {
    render(<App />);

    expect(
      screen.getByRole("link", { name: /skip to main content/i }),
    ).toHaveAttribute("href", "#main-content");
    expect(
      screen.getByRole("main", { name: /home content/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /start with one steady step/i }),
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
      screen.getByRole("heading", { name: /understand panic support/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/support, not diagnosis/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back to home/i }));
    expect(
      screen.getByRole("heading", { name: /start with one steady step/i }),
    ).toBeInTheDocument();
  });

  it("toggles low-stimulation mode", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = screen.getByRole("button", { name: /low stim/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: /standard/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("walks through the SOS wizard and branches to breathing", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );

    expect(
      screen.getByRole("heading", { name: /plant your feet/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /i am here/i }));
    expect(
      screen.getByRole("heading", { name: /read this slowly/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/this feeling is intense/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /i read it/i }));
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await user.click(screen.getByRole("button", { name: /^next$/i }));

    expect(
      screen.getByRole("heading", { name: /what would help next/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /paced breathing/i }));
    expect(
      screen.getByRole("heading", { name: /breathe in gently/i }),
    ).toBeInTheDocument();
  });

  it("updates personalization settings and passes support contact into SOS", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^settings$/i }));

    await user.type(screen.getByLabelText(/add phrase/i), "I can pause.");
    await user.click(screen.getAllByRole("button", { name: /^add$/i })[0]!);
    expect(screen.getByText("I can pause.")).toBeInTheDocument();

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

    await waitFor(() => expect(speech.speak).toHaveBeenCalled());
    const utterance = speech.speak.mock.calls[0]?.[0] as SpeechSynthesisUtterance;
    expect(utterance.text).toMatch(/Plant your feet/i);
    expect(utterance.text).toMatch(/Press both feet/i);

    const cancelCount = speech.cancel.mock.calls.length;
    await user.click(screen.getByRole("button", { name: /stop voice/i }));
    expect(speech.cancel.mock.calls.length).toBeGreaterThan(cancelCount);
  });

  it("does not read SOS guidance when voice guide is disabled", async () => {
    const user = userEvent.setup();
    render(<App />);

    vi.clearAllMocks();
    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );

    expect(speech.speak).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: /stop voice/i }),
    ).not.toBeInTheDocument();
  });

  it("disables the voice guide preference when speech synthesis is unavailable", async () => {
    const user = userEvent.setup();
    const originalSpeechSynthesis = window.speechSynthesis;

    Object.defineProperty(window, "speechSynthesis", {
      value: undefined,
      configurable: true,
    });

    try {
      render(<App />);
      await user.click(screen.getByRole("button", { name: /^settings$/i }));

      expect(
        screen.getByRole("button", { name: /voice guide unavailable/i }),
      ).toBeDisabled();
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

    await waitFor(() => expect(speech.speak).toHaveBeenCalled());
    const cancelCount = speech.cancel.mock.calls.length;

    await user.click(screen.getByRole("button", { name: /^home$/i }));
    expect(speech.cancel.mock.calls.length).toBeGreaterThan(cancelCount);
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
    expect(screen.getAllByText(/new, severe, unusual/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/call 911 for immediate danger/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back to home/i }));
    await user.click(screen.getByRole("button", { name: /^settings$/i }));
    expect(screen.getByText(/does not diagnose symptoms/i)).toBeInTheDocument();
  });

  it("saves an optional journal note locally", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );
    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/what may have triggered this/i),
      "Crowded train",
    );
    await user.type(screen.getByLabelText(/what helped/i), "Grounding");
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );
    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    expect(screen.getByText(/crowded train/i)).toBeInTheDocument();
    expect(screen.getByText(/grounding/i)).toBeInTheDocument();
  });

  it("exports and deletes journal notes locally", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );
    await user.click(screen.getByRole("button", { name: /^journal$/i }));
    await user.type(
      screen.getByLabelText(/what may have triggered this/i),
      "Crowded train",
    );
    await user.type(screen.getByLabelText(/what helped/i), "Grounding");
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );
    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    const exportLink = screen.getByRole("link", {
      name: /download journal json/i,
    });
    expect(exportLink).toHaveAttribute("download", "clearspace-journal.json");
    expect(
      decodeURIComponent(exportLink.getAttribute("href") ?? ""),
    ).toContain("Crowded train");

    await user.click(screen.getByRole("button", { name: /delete note/i }));
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /download journal json/i }),
    ).not.toBeInTheDocument();
  });

  it("requires a second click before deleting all journal notes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );
    await user.click(screen.getByRole("button", { name: /^journal$/i }));
    await user.type(screen.getByLabelText(/what helped/i), "Breathing");
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );
    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    await user.click(screen.getByRole("button", { name: /delete all notes/i }));
    expect(screen.getByText(/breathing/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /confirm delete all/i }));
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it("can skip journaling without creating a note", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );
    await user.click(screen.getByRole("button", { name: /^journal$/i }));
    await user.click(screen.getByRole("button", { name: /^skip$/i }));

    await user.click(
      screen.getByRole("button", { name: /start calming support/i }),
    );
    await user.click(screen.getByRole("button", { name: /^journal$/i }));

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it("opens offline Spark Joy prompts without the SOS path", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /spark joy/i }));

    expect(screen.getByRole("heading", { name: /color hunt/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /another/i }));
    expect(screen.getByRole("heading", { name: /tiny reset/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^done$/i }));
    expect(
      screen.getByRole("button", { name: /start calming support/i }),
    ).toBeInTheDocument();
  });
});
