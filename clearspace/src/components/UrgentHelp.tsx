import { useEffect, useRef } from "react";
import { Phone, X } from "lucide-react";
import type { SupportContact } from "../types";

export function UrgentHelp({
  contact,
  onClose,
}: {
  contact: SupportContact;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (!dialog) return;
    dialog.showModal();
    title.current?.focus();
    return () => {
      dialog.close();
      opener?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="help-dialog"
      aria-labelledby="help-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="help-top">
        <h2 ref={title} tabIndex={-1} id="help-title">
          Get urgent help
        </h2>
        <button
          type="button"
          className="circle-control"
          aria-label="Close urgent help"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <p>
        New chest pain, fainting, or severe trouble breathing can be a medical
        emergency. Call your local emergency number now if you may be in danger.
      </p>
      <a className="call-link" href="tel:911">
        <Phone size={18} aria-hidden="true" /> Call 911 in the U.S.
      </a>
      <p>
        If symptoms are new or different from usual, seek medical advice. You
        can leave the exercise at any point.
      </p>
      {contact.phone.trim() && (
        <a className="text-action" href={"tel:" + contact.phone}>
          Call {contact.name.trim() || "my support person"}
        </a>
      )}
      <button type="button" className="secondary-button" onClick={onClose}>
        Go back
      </button>
    </dialog>
  );
}
