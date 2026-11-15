import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
const click = (name: RegExp) =>
  userEvent.click(screen.getByRole("button", { name }));

async function makePlan() {
  await click(/afraid it might happen/i);
  await click(/make a small plan/i);
  await click(/go to a shop/i);
  await click(/choose my step/i);
  await userEvent.click(screen.getByText("What worries me (optional)"));
  await userEvent.type(
    screen.getByLabelText(/what am i afraid/i),
    "Someone will notice and I will leave.",
  );
  await click(/see my plan/i);
  await click(/keep this plan/i);
}

describe("Support before, during and after", () => {
  it("offers four plain-language entry points and immediate support without setup", async () => {
    render(<App />);
    for (const name of [
      /help me through this/i,
      /afraid it might happen/i,
      /it just happened/i,
      /i want to practice/i,
    ]) {
      expect(screen.getByRole("button", { name })).toBeEnabled();
    }
    await click(/help me through this/i);
    expect(
      screen.getByRole("heading", { name: /feel one steady surface/i }),
    ).toBeVisible();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("keeps a plan, recalls it after remount and allows leaving early to be recorded in the person's words", async () => {
    const view = render(<App />);
    await makePlan();
    await click(/i’ll try this step/i);
    expect(screen.getByText(/put your phone away/i)).toBeVisible();
    view.unmount();
    render(<App />);
    await click(/my saved step.*go to a shop/i);
    expect(screen.getByText("Go inside and look at one thing.")).toBeVisible();
    await click(/look back on it/i);
    expect(
      screen.getByRole("button", { name: /keep this reflection/i }),
    ).toBeDisabled();
    await userEvent.type(
      screen.getByLabelText(/what happened/i),
      "I went in, felt shaky, and chose to leave.",
    );
    await userEvent.type(
      screen.getByLabelText(/want to remember/i),
      "I can try a shorter visit next time.",
    );
    await click(/keep this reflection/i);
    const stored = JSON.parse(localStorage.getItem("clearspace:small-steps")!);
    expect(stored[0].attempts[0].happened).toContain("chose to leave");
    expect(stored[0].attempts[0]).not.toHaveProperty("success");
    await userEvent.click(screen.getByText("What I noticed before"));
    expect(screen.getByText(/shorter visit next time/i)).toBeVisible();
  });

  it("preserves an interrupted draft and supports changing a saved step without losing reflections", async () => {
    const view = render(<App />);
    await click(/afraid it might happen/i);
    await click(/make a small plan/i);
    await userEvent.type(
      screen.getByLabelText(/something i want to do/i),
      "Attend a meeting",
    );
    view.unmount();
    render(<App />);
    await click(/afraid it might happen/i);
    await click(/make a small plan/i);
    expect(screen.getByLabelText(/something i want to do/i)).toHaveValue(
      "Attend a meeting",
    );
    await click(/choose my step/i);
    await userEvent.type(
      screen.getByLabelText(/my first step/i),
      "Join for ten minutes.",
    );
    await click(/see my plan/i);
    await click(/keep this plan/i);
    await click(/make it smaller/i);
    await click(/choose my step/i);
    await userEvent.clear(screen.getByLabelText(/my first step/i));
    await userEvent.type(
      screen.getByLabelText(/my first step/i),
      "Join for five minutes.",
    );
    await click(/see my plan/i);
    await click(/keep this plan/i);
    expect(
      JSON.parse(localStorage.getItem("clearspace:small-steps")!),
    ).toHaveLength(1);
    expect(screen.getByText("Join for five minutes.")).toBeVisible();
  });

  it("asks before removing a saved plan and removes its reflections with it", async () => {
    render(<App />);
    await makePlan();
    await userEvent.click(screen.getByText("Manage this plan"));
    await click(/remove this plan/i);
    expect(
      JSON.parse(localStorage.getItem("clearspace:small-steps")!),
    ).toHaveLength(1);
    await click(/yes, remove plan/i);
    expect(JSON.parse(localStorage.getItem("clearspace:small-steps")!)).toEqual(
      [],
    );
  });

  it("offers aftercare directly, with no required record of an attack", async () => {
    render(<App />);
    await click(/it just happened/i);
    expect(
      screen.getByRole("heading", { name: /a moment for yourself/i }),
    ).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    await click(/take a quiet moment/i);
    expect(
      screen.getByRole("heading", { name: /take the time you need/i }),
    ).toHaveFocus();
    await click(/when i’m ready/i);
    expect(
      screen.getByRole("button", { name: /back to my day/i }),
    ).toBeEnabled();
    await click(/i’d like support again/i);
    expect(
      screen.getByRole("heading", { name: /feel one steady surface/i }),
    ).toBeVisible();
    expect(localStorage.getItem("clearspace:support-check-ins")).toBeNull();
  });

  it("lets a person show a custom message and restores focus when the card closes", async () => {
    localStorage.setItem(
      "clearspace:support-message",
      JSON.stringify("Please give me space to speak."),
    );
    render(<App />);
    await click(/help me through this/i);
    const opener = screen.getByRole("button", {
      name: /show someone what i need/i,
    });
    await userEvent.click(opener);
    const card = screen.getByRole("dialog", { name: /a message for you/i });
    expect(
      within(card).getByText("Please give me space to speak."),
    ).toBeVisible();
    await click(/close my message/i);
    expect(opener).toHaveFocus();
  });

  it("works with an unanswered worry without requiring symptom tracking", async () => {
    render(<App />);
    await click(/i want to practice/i);
    await click(/untangle a worry/i);
    await click(/another “what if”/i);
    await userEvent.type(
      screen.getByLabelText(/what would i like to return to/i),
      "Making lunch",
    );
    expect(
      screen.getByText(/give my attention to making lunch/i),
    ).toBeVisible();
    await click(/back to what i was doing/i);
    expect(
      screen.getByRole("button", { name: /help me through this/i }),
    ).toBeVisible();
    expect(localStorage.getItem("clearspace:support-check-ins")).toBeNull();
  });

  it("allows the CBT pattern example without personal disclosure", async () => {
    render(<App />);
    await click(/i want to practice/i);
    await click(/understand my pattern/i);
    await click(/^next$/i);
    await click(/^next$/i);
    await click(/^next$/i);
    expect(screen.getByText("I left the queue.")).toBeVisible();
    expect(screen.getAllByText("Example")).toHaveLength(3);
  });
});

describe("Returning to an interrupted activity", () => {
  const plans = [
    {
      id: "older",
      createdAt: "2026-11-10T16:00:00Z",
      activity: "Go to a shop",
      action: "Look at one item.",
      prediction: "",
      source: "mine",
      attempts: [],
    },
    {
      id: "newer",
      createdAt: "2026-11-15T16:00:00Z",
      activity: "Go to an appointment",
      action: "Check in.",
      prediction: "",
      source: "mine",
      attempts: [],
    },
  ];
  function savedPlans() {
    localStorage.setItem(
      "clearspace:small-steps",
      JSON.stringify([...plans].reverse()),
    );
  }

  it("returns to the last chosen plan and keeps an unfinished reflection across support and a remount", async () => {
    savedPlans();
    const view = render(<App />);
    await click(/^my steps$/i);
    await click(/go to a shop.*look at one item/i);
    await click(/look back on it/i);
    await userEvent.type(screen.getByLabelText(/what happened/i), "I went in.");
    await click(/i’d like support now/i);
    await click(/exit guide/i);
    expect(
      screen.getByRole("button", { name: /my saved step.*go to a shop/i }),
    ).toBeVisible();
    view.unmount();
    render(<App />);
    await click(/my saved step.*go to a shop/i);
    await click(/look back on it/i);
    expect(screen.getByLabelText(/what happened/i)).toHaveValue("I went in.");
    await click(/keep this reflection/i);
    expect(
      JSON.parse(localStorage.getItem("clearspace:reflection-drafts")!),
    ).not.toHaveProperty("older");
  });

  it("keeps an unfinished edit distinct from the saved plan, and supports discarding it", async () => {
    savedPlans();
    const view = render(<App />);
    await click(/^my steps$/i);
    await click(/go to a shop.*look at one item/i);
    await click(/make it smaller/i);
    await click(/choose my step/i);
    await userEvent.clear(screen.getByLabelText(/my first step/i));
    await userEvent.type(
      screen.getByLabelText(/my first step/i),
      "Look through the doorway.",
    );
    view.unmount();
    render(<App />);
    await click(/my saved step.*go to a shop/i);
    expect(screen.getByText("Look at one item.")).toBeVisible();
    await click(/make it smaller/i);
    await click(/choose my step/i);
    expect(screen.getByLabelText(/my first step/i)).toHaveValue(
      "Look through the doorway.",
    );
    await click(/discard these changes/i);
    expect(screen.getByLabelText(/my first step/i)).toHaveValue(
      "Look at one item.",
    );
    expect(
      JSON.parse(localStorage.getItem("clearspace:pending-step-edits")!),
    ).not.toHaveProperty("older");
  });

  it("reports a blocked save and lets the user retry without losing the current plan", async () => {
    const original = Storage.prototype.setItem;
    render(<App />);
    Storage.prototype.setItem = () => {
      throw new DOMException("Full", "QuotaExceededError");
    };
    try {
      await makePlan();
      expect(
        screen.getByText(/couldn’t save your latest changes/i),
      ).toBeVisible();
      expect(
        screen.getByRole("heading", { name: "Go to a shop" }),
      ).toBeVisible();
    } finally {
      Storage.prototype.setItem = original;
    }
    await click(/try saving again/i);
    expect(
      screen.queryByText(/couldn’t save your latest changes/i),
    ).not.toBeInTheDocument();
    expect(
      JSON.parse(localStorage.getItem("clearspace:small-steps")!),
    ).toHaveLength(1);
  });
});

it("removes the selected plan's unfinished drafts without deleting another plan's drafts", async () => {
  const plan = {
    id: "first",
    createdAt: "2026-11-15T16:00:00Z",
    activity: "Visit a shop",
    action: "Go in.",
    prediction: "",
    source: "mine",
    attempts: [],
  };
  localStorage.setItem("clearspace:small-steps", JSON.stringify([plan]));
  localStorage.setItem(
    "clearspace:reflection-drafts",
    JSON.stringify({
      first: { happened: "Unfinished", learned: "" },
      other: { happened: "Keep this", learned: "" },
    }),
  );
  localStorage.setItem(
    "clearspace:pending-step-edits",
    JSON.stringify({
      first: {
        activity: "Visit a shop",
        action: "Stand at the door.",
        prediction: "",
        source: "mine",
      },
      other: {
        activity: "Another plan",
        action: "Keep this.",
        prediction: "",
        source: "mine",
      },
    }),
  );
  render(<App />);
  await click(/my saved step.*visit a shop/i);
  await userEvent.click(screen.getByText("Manage this plan"));
  await click(/remove this plan/i);
  await click(/yes, remove plan/i);
  expect(
    JSON.parse(localStorage.getItem("clearspace:reflection-drafts")!),
  ).toEqual({ other: { happened: "Keep this", learned: "" } });
  expect(
    JSON.parse(localStorage.getItem("clearspace:pending-step-edits")!),
  ).not.toHaveProperty("first");
  expect(
    JSON.parse(localStorage.getItem("clearspace:pending-step-edits")!),
  ).toHaveProperty("other");
});

it("the My steps navigation returns to the list while keeping an unfinished reflection", async () => {
  const plan = {
    id: "step",
    createdAt: "2026-11-15T16:00:00Z",
    activity: "See a friend",
    action: "Arrange a short visit.",
    prediction: "",
    source: "mine",
    attempts: [],
  };
  localStorage.setItem("clearspace:small-steps", JSON.stringify([plan]));
  render(<App />);
  await click(/my saved step.*see a friend/i);
  await click(/look back on it/i);
  await userEvent.type(
    screen.getByLabelText(/what happened/i),
    "I sent a message.",
  );
  await userEvent.click(
    within(screen.getByRole("navigation")).getByRole("button", {
      name: "My steps",
      exact: true,
    }),
  );
  expect(
    screen.getByRole("heading", { name: "My small steps." }),
  ).toBeVisible();
  await click(/see a friend.*arrange a short visit/i);
  await click(/look back on it/i);
  expect(screen.getByLabelText(/what happened/i)).toHaveValue(
    "I sent a message.",
  );
});

it("an unsaved reflection remains usable across views while browser storage is blocked", async () => {
  const plan = {
    id: "blocked",
    createdAt: "2026-11-15T16:00:00Z",
    activity: "Go to a shop",
    action: "Go in.",
    prediction: "",
    source: "mine",
    attempts: [],
  };
  localStorage.setItem("clearspace:small-steps", JSON.stringify([plan]));
  const original = Storage.prototype.setItem;
  render(<App />);
  Storage.prototype.setItem = () => {
    throw new DOMException("Full", "QuotaExceededError");
  };
  try {
    await click(/my saved step.*go to a shop/i);
    await click(/look back on it/i);
    await userEvent.type(
      screen.getByLabelText(/what happened/i),
      "Keep my words while I ask for support.",
    );
    await click(/i’d like support now/i);
    await click(/exit guide/i);
    await click(/my saved step.*go to a shop/i);
    await click(/look back on it/i);
    expect(screen.getByLabelText(/what happened/i)).toHaveValue(
      "Keep my words while I ask for support.",
    );
  } finally {
    Storage.prototype.setItem = original;
  }
  await click(/try saving again/i);
  expect(
    JSON.parse(localStorage.getItem("clearspace:reflection-drafts")!).blocked
      .happened,
  ).toContain("Keep my words");
});
