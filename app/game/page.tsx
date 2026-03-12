import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "../../components/AppShell";
import GameForm from "../../components/GameForm";
import DarkModeToggle from "../../components/DarkModeToggle";

export const metadata: Metadata = {
  title: "Play Emoji Trivia",
  description:
    "Play Triviamoji sudden-death mode and solve emoji trivia puzzles across multiple categories.",
  alternates: {
    canonical: "/game",
  },
};

export default function Page() {
  const isSuddenDeath = true;
  const topBannerSlotId = process.env.NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT;

  return (
    <AppShell adSlotId={topBannerSlotId}>
      <GameForm isSuddenDeath={isSuddenDeath} />
      <footer className="tm-footer mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-2 pb-4 text-sm text-slate-700">
        <DarkModeToggle />
        <a href="https://x.com/eliothectorson" target="_blank" rel="noreferrer" className="tm-link-chip tm-pill-hover">
          𝕏 Follow @eliothectorson
        </a>
        <Link href="/about" className="tm-link">
          About
        </Link>
        <Link href="/privacy-policy" className="tm-link">
          Privacy
        </Link>
        <Link href="/terms" className="tm-link">
          Terms
        </Link>
        <Link href="/contact" className="tm-link">
          Contact
        </Link>
      </footer>
    </AppShell>
  );
}
