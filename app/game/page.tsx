import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "../../components/AppShell";
import GameForm from "../../components/GameForm";
import DarkModeToggle from "../../components/DarkModeToggle";
import MailingListButton from "../../components/MailingListButton";

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
      <footer className="tm-footer mx-auto mt-6 flex max-w-4xl flex-col items-center gap-y-3 pb-4 text-sm text-slate-700">
        <div className="tm-footer-tools">
          <DarkModeToggle />
          <a href="https://x.com/eliothectorson" target="_blank" rel="noreferrer" className="tm-link-chip tm-pill-hover inline-flex items-center gap-2">
            <img src="/images/blurryface_small.jpg" alt="Profile photo for @eliothectorson on X" className="h-5 w-5 rounded-full object-cover" />
            <span>𝕏 Follow @eliothectorson</span>
          </a>
          <MailingListButton className="tm-footer-mailing" />
        </div>
        <div className="tm-footer-links">
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
        </div>
      </footer>
    </AppShell>
  );
}
