import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import {
  createStorageKey,
  readLocalStorageValue,
  useLocalStorage,
} from "./useLocalStorage";

function Harness() {
  const [value, setValue] = useLocalStorage("test-value", "fallback");

  return (
    <div>
      <span data-testid="value">{value}</span>
      <button type="button" onClick={() => setValue("stored")}>
        Store
      </button>
      <button type="button" onClick={() => setValue((current) => `${current}!`)}>
        Append
      </button>
    </div>
  );
}

function WriteFailureHarness() {
  const [value, setValue] = useLocalStorage("write-failure", "fallback");

  return (
    <div>
      <span data-testid="write-failure-value">{value}</span>
      <button type="button" onClick={() => setValue("state-only")}>
        Store
      </button>
    </div>
  );
}

describe("useLocalStorage", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("uses namespaced storage keys", () => {
    expect(createStorageKey("preferences")).toBe("clearspace:preferences");
  });

  it("falls back when stored JSON is malformed", () => {
    window.localStorage.setItem(createStorageKey("broken"), "{not json");

    expect(readLocalStorageValue("broken", "safe")).toBe("safe");
  });

  it("falls back when stored JSON has the wrong shape", () => {
    window.localStorage.setItem(
      createStorageKey("wrong-shape"),
      JSON.stringify(["not", "a", "contact"]),
    );

    expect(
      readLocalStorageValue(
        "wrong-shape",
        { name: "", phone: "" },
        {
          validate: (
            value,
          ): value is {
            name: string;
            phone: string;
          } =>
            typeof value === "object" &&
            value !== null &&
            "name" in value &&
            "phone" in value &&
            typeof value.name === "string" &&
            typeof value.phone === "string",
        },
      ),
    ).toEqual({ name: "", phone: "" });
  });

  it("falls back when stored JSON is missing required fields", () => {
    window.localStorage.setItem(
      createStorageKey("missing-fields"),
      JSON.stringify({ name: "Alex" }),
    );

    expect(
      readLocalStorageValue(
        "missing-fields",
        { name: "", phone: "" },
        {
          validate: (
            value,
          ): value is {
            name: string;
            phone: string;
          } =>
            typeof value === "object" &&
            value !== null &&
            "name" in value &&
            "phone" in value &&
            typeof value.name === "string" &&
            typeof value.phone === "string",
        },
      ),
    ).toEqual({ name: "", phone: "" });
  });

  it("migrates valid legacy shapes and stores the migrated value", () => {
    window.localStorage.setItem(
      createStorageKey("legacy-list"),
      JSON.stringify(["one", "two"]),
    );

    const value = readLocalStorageValue(
      "legacy-list",
      { version: 1, items: [] },
      {
        migrate: (stored) =>
          Array.isArray(stored) && stored.every((item) => typeof item === "string")
            ? { version: 1, items: stored }
            : undefined,
        validate: (
          stored,
        ): stored is {
          version: number;
          items: string[];
        } =>
          typeof stored === "object" &&
          stored !== null &&
          "version" in stored &&
          "items" in stored &&
          stored.version === 1 &&
          Array.isArray(stored.items) &&
          stored.items.every((item) => typeof item === "string"),
      },
    );

    expect(value).toEqual({ version: 1, items: ["one", "two"] });
    expect(window.localStorage.getItem(createStorageKey("legacy-list"))).toBe(
      JSON.stringify({ version: 1, items: ["one", "two"] }),
    );
  });

  it("persists values and supports functional updates", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.getByTestId("value")).toHaveTextContent("fallback");

    await user.click(screen.getByRole("button", { name: /store/i }));
    expect(screen.getByTestId("value")).toHaveTextContent("stored");
    expect(window.localStorage.getItem(createStorageKey("test-value"))).toBe(
      JSON.stringify("stored"),
    );

    await user.click(screen.getByRole("button", { name: /append/i }));
    expect(screen.getByTestId("value")).toHaveTextContent("stored!");
  });

  it("updates React state without crashing when storage writes fail", async () => {
    const user = userEvent.setup();
    const setItem = Storage.prototype.setItem;

    Storage.prototype.setItem = () => {
      throw new Error("quota exceeded");
    };

    try {
      render(<WriteFailureHarness />);

      await user.click(screen.getByRole("button", { name: /store/i }));

      expect(screen.getByTestId("write-failure-value")).toHaveTextContent(
        "state-only",
      );
    } finally {
      Storage.prototype.setItem = setItem;
    }
  });
});
