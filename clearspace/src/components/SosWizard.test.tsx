import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { SosWizard } from "./SosWizard";

const baseProps = {
  phrases: ["One steady step."],
  supportContact: { name: "", phone: "" },
  onExitHome: vi.fn(),
  onExitJournal: vi.fn(),
  onStartBreathing: vi.fn(),
  onStartGrounding: vi.fn(),
};

describe("SosWizard", () => {
  it("does not show a support contact link when no phone is configured", () => {
    render(<SosWizard {...baseProps} />);

    expect(screen.queryByRole("link", { name: /call/i })).not.toBeInTheDocument();
  });

  it("shows a support contact link only when a phone is configured", () => {
    render(
      <SosWizard
        {...baseProps}
        supportContact={{ name: "Alex", phone: "555-0100" }}
      />,
    );

    expect(screen.getByRole("link", { name: /call alex/i })).toHaveAttribute(
      "href",
      "tel:555-0100",
    );
  });
});
