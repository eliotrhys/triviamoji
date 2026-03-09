import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "../../components/AppShell";
import GameForm from "../../components/GameForm";

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
      <section className="tm-help-card mx-auto mt-4 w-full max-w-5xl rounded-2xl p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">💡 Need Help?</div>
        <h3 className="mt-2 text-2xl font-semibold text-slate-800">Learn the rules in 20 seconds</h3>
        <Link href="/" className="tm-link-chip mt-4 inline-flex">
          How to play →
        </Link>
      </section>
      <footer className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-2 pb-4 text-sm text-slate-700">
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
