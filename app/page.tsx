"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DailyChallenge from "../components/DailyChallenge";
import AppShell from "../components/AppShell";
import HowToPlayModal from "../components/HowToPlayModal";
import DarkModeToggle from "../components/DarkModeToggle";
import MailingListButton from "../components/MailingListButton";

export default function Page() {
  const topBannerSlotId = process.env.NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT;
  const [highScore, setHighScore] = useState<number | null>(null);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [dailyHeaderMeta, setDailyHeaderMeta] = useState({ streak: 0, nextInLabel: "--" });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const parsedHighScore = parseInt(localStorage.getItem("highestScoreSuddenDeath") ?? "0", 10);
    setHighScore(parsedHighScore > 0 ? parsedHighScore : null);
  }, []);

  const displayDate = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  return (
    <>
      <AppShell adSlotId={topBannerSlotId}>
        <section className="tm-hero mx-auto mb-2 w-full max-w-5xl py-2 sm:py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <img src="/images/triviamojilogo.png" alt="TriviaMoji logo" className="h-14 w-auto sm:h-16 md:h-[4.5rem]" />
              <p className="text-sm text-slate-600 sm:text-base">Daily Puzzle • {displayDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="tm-pill tm-pill-hover">
                🔥 Streak <span className="tm-pill-number">{dailyHeaderMeta.streak}</span>
              </span>
              <span className="tm-pill tm-pill-hover">
                🕒 Next in <span className="tm-pill-number tm-pill-number-wide">{dailyHeaderMeta.nextInLabel}</span>
              </span>
              <button type="button" onClick={() => setIsHowToPlayOpen(true)} className="tm-link-chip tm-pill-hover text-sm">
                ❓ How to play
              </button>
            </div>
          </div>
        </section>

        <DailyChallenge onHeaderMetaChange={setDailyHeaderMeta} />

        <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          <div className="tm-sd-promo rounded-2xl p-5 pb-7 text-white lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">The Ultimate Emoji Gauntlet</div>
            <h2 className="tm-title mt-2 text-4xl text-white sm:text-5xl">☠️ Play Sudden Death ☠️</h2>
            <p className="mt-2 text-lg text-white sm:text-2xl">One wrong guess and your run is <span className="font-bold text-red-600">over.</span></p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link href="/game" className="tm-btn-danger">
                Play Sudden Death
              </Link>
              {highScore === null ? (
                <span className="tm-pill tm-pill-on-dark tm-pill-hover">No high score yet</span>
              ) : (
                <span className="tm-pill tm-pill-on-dark tm-pill-hover">
                  High score <span className="tm-pill-number tm-pill-number-on-dark">{highScore}</span>
                </span>
              )}
            </div>
          </div>

          <div className="tm-help-card rounded-2xl p-5 pb-7">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Need Help?</div>
            <h3 className="tm-title mt-2 text-3xl">How To Play</h3>
            <p className="mt-2 text-lg text-slate-600">New player? Learn the rules in 20 seconds.</p>
            <button type="button" onClick={() => setIsHowToPlayOpen(true)} className="tm-btn-ghost mt-4 w-full justify-center">
              View Instructions
            </button>
          </div>
        </section>

        <footer className="tm-footer mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-2 pb-4 text-sm text-slate-700">
          <DarkModeToggle />
          <a href="https://x.com/eliothectorson" target="_blank" rel="noreferrer" className="tm-link-chip tm-pill-hover inline-flex items-center gap-2">
            <img src="/images/blurryface_small.jpg" alt="Profile photo for @eliothectorson on X" className="h-5 w-5 rounded-full object-cover" />
            <span>𝕏 Follow @eliothectorson</span>
          </a>
          <MailingListButton />
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

      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
    </>
  );
}
