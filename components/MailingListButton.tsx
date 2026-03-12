"use client";

import { FormEvent, useState } from "react";

interface MailingListButtonProps {
  className?: string;
}

export default function MailingListButton({ className = "" }: MailingListButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const closeModal = () => {
    setIsOpen(false);
    setStatusMessage("");
    setStatusType("");
    setEmail("");
  };

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const response = await fetch("/api/ghost/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatusType("error");
        setStatusMessage(payload.message ?? "Could not subscribe right now. Please try again.");
        return;
      }

      setStatusType("success");
      setStatusMessage(payload.message ?? "You are in. Check your inbox for confirmation.");
      setEmail("");
    } catch {
      setStatusType("error");
      setStatusMessage("Network error. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button type="button" className={`tm-link-chip tm-pill-hover ${className}`} onClick={() => setIsOpen(true)}>
        ✉️ Join Mailing List
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-900/45 p-3 sm:items-center sm:justify-center" onClick={closeModal}>
          <div
            className="tm-card w-full max-w-md p-6 sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-label="Join Eliot Hector Son mailing list"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="tm-title text-2xl">Join Mailing List</h3>
                <p className="mt-1 text-sm text-slate-600">Get updates from eliothectorson.com</p>
              </div>
              <button type="button" onClick={closeModal} className="tm-btn-ghost !px-3 !py-1.5 text-sm">
                Close
              </button>
            </div>

            <form onSubmit={submitEmail} className="space-y-3">
              <label htmlFor="mailing-list-email" className="block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                id="mailing-list-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="tm-input"
                placeholder="you@example.com"
                autoComplete="email"
              />

              <button type="submit" className="tm-btn-primary w-full justify-center" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Join Mailing List"}
              </button>
            </form>

            {statusMessage && (
              <div className={`mt-3 rounded-xl border px-3 py-2 text-sm ${statusType === "success" ? "tm-feedback-correct" : "tm-feedback-wrong"}`}>
                {statusMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
