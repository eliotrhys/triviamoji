import Link from "next/link";

interface NavbarProps {
  onMenuToggle: () => void;
  modeLabel?: string;
  dateLabel?: string;
  showHowToPlay?: boolean;
}

export default function Navbar({ onMenuToggle, modeLabel = "Daily Puzzle", dateLabel, showHowToPlay = true }: NavbarProps) {
  return (
    <header className="mx-auto mb-3 mt-1 flex w-full max-w-5xl items-center justify-between py-1 sm:py-2">
      <div className="flex items-center gap-3">
        <Link href="/?daily=0">
          <img src="/images/triviamojilogo.png" alt="TriviaMoji logo" className="h-14 w-auto sm:h-16 md:h-[4.5rem]" />
        </Link>
        <p className="tm-nav-subtitle text-sm text-slate-600 sm:text-base">
          {modeLabel}
          {dateLabel ? ` • ${dateLabel}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {showHowToPlay && (
          <Link href="/" className="tm-link-chip text-sm">
            ❓ How to play
          </Link>
        )}
        <button type="button" className="tm-btn-ghost tm-options-btn" onClick={onMenuToggle}>
          Options
        </button>
      </div>
    </header>
  );
}
