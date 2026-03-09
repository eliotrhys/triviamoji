"use client";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-900/45 p-3 sm:items-center sm:justify-center" onClick={onClose}>
      <div
        className="tm-card w-full max-w-xl p-6 sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-label="How to play TriviaMoji"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 className="tm-title text-2xl">How To Play</h3>
          <button type="button" onClick={onClose} className="tm-btn-ghost !px-3 !py-1.5 text-sm">
            Close
          </button>
        </div>

        <ul className="space-y-3 text-slate-700">
          <li>1. Look at the emoji puzzle and guess the title.</li>
          <li>2. Type your answer and press submit.</li>
          <li>3. You get 3 guesses for the daily puzzle.</li>
          <li>4. Keep solving daily to grow your streak.</li>
          <li>5. Play Sudden Death for unlimited puzzles and high scores.</li>
        </ul>
      </div>
    </div>
  );
}
