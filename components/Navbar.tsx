import Link from "next/link";

interface NavbarProps {
  onMenuToggle: () => void;
  modeLabel?: string;
  dateLabel?: string;
}

export default function Navbar({ onMenuToggle, modeLabel = "Daily Puzzle", dateLabel }: NavbarProps) {
  return (
    <header className="mx-auto mb-3 mt-1 flex w-full max-w-5xl items-center justify-between py-1 sm:py-2">
      <div className="flex items-center gap-3">
        <Link href="/">
          <img src="/images/horizontalLogo.png" alt="TriviaMoji" className="h-10 w-auto sm:h-12" />
        </Link>
        <p className="text-sm text-slate-600 sm:text-base">
          {modeLabel}
          {dateLabel ? ` • ${dateLabel}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/" className="tm-link-chip text-sm">
          ❓ How to play
        </Link>
        <button type="button" className="tm-btn-ghost" onClick={onMenuToggle}>
          Options
        </button>
      </div>
    </header>
  );
}
