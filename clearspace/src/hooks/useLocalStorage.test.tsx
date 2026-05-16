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
});
