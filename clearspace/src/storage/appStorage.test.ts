import { describe, expect, it } from "vitest";
import { migrateToolkitItems, storageValidators } from "./appStorage";

describe("app storage schemas", () => {
  it("accepts valid support contact data", () => {
    expect(
      storageValidators.supportContact({ name: "Alex", phone: "555-0100" }),
    ).toBe(true);
  });

  it("rejects support contact data with missing fields", () => {
    expect(storageValidators.supportContact({ name: "Alex" })).toBe(false);
  });

  it("rejects invalid focus profile ids", () => {
    expect(storageValidators.focusProfile("not-a-profile")).toBe(false);
  });

  it("accepts valid support check-ins", () => {
    expect(
      storageValidators.supportCheckIns([
        {
          id: "check-1",
          createdAt: "2026-05-16T00:00:00.000Z",
          source: "grounding",
          shift: "a-little-calmer",
          helped: "grounding-helped",
        },
      ]),
    ).toBe(true);
  });

  it("rejects malformed support check-ins", () => {
    expect(
      storageValidators.supportCheckIns([
        {
          id: "check-1",
          createdAt: "2026-05-16T00:00:00.000Z",
          source: "unknown",
          shift: "a-little-calmer",
          helped: "grounding-helped",
        },
      ]),
    ).toBe(false);
  });

  it("migrates legacy toolkit text arrays into toolkit item records", () => {
    expect(migrateToolkitItems(["Water", "Headphones"])).toEqual([
      {
        id: "legacy-toolkit-0",
        text: "Water",
        checked: false,
      },
      {
        id: "legacy-toolkit-1",
        text: "Headphones",
        checked: false,
      },
    ]);
  });
});

describe("small step storage", () => {
  it("rejects incomplete or corrupt records while accepting user-authored setbacks", async () => {
    const { isSmallSteps } = await import("./appStorage");
    const plan = {
      id: "one",
      createdAt: "2026-11-15T16:00:00.000Z",
      activity: "Go to a shop",
      action: "Look at one item.",
      prediction: "I will leave.",
      source: "mine",
      attempts: [
        {
          id: "first",
          createdAt: "2026-11-15T17:00:00.000Z",
          happened: "I left.",
          learned: "Try again when ready.",
        },
      ],
    };
    expect(isSmallSteps([plan])).toBe(true);
    expect(isSmallSteps([{ ...plan, activity: "" }])).toBe(false);
    expect(isSmallSteps([{ ...plan, attempts: [{ id: "invalid" }] }])).toBe(
      false,
    );
    expect(isSmallSteps([{ ...plan, createdAt: "tomorrow" }])).toBe(false);
    expect(isSmallSteps([{ ...plan, source: "automatic" }])).toBe(false);
  });
});
