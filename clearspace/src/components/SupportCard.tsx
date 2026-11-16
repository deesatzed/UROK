import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export const defaultSupportMessage =
  "I’m feeling overwhelmed. Please stay nearby and give me a moment. Ask me before touching me.";
export function SupportCard({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    element?.showModal();
    heading.current?.focus();
    return () => {
      element?.close();
      opener?.focus();
    };
  }, []);
  return (
    <dialog
      className="help-dialog support-card"
      ref={dialog}
      aria-labelledby="support-card-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="help-top">
        <h2 id="support-card-title" ref={heading} tabIndex={-1}>
          A message for you
        </h2>
        <button
          className="circle-control"
          aria-label="Close my message"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <p className="support-message">
        {message.trim() || defaultSupportMessage}
      </p>
      <button className="action-secondary" onClick={onClose}>
        Go back
      </button>
    </dialog>
  );
}
