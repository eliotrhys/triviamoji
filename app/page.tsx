"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import DailyChallenge from "../components/DailyChallenge";
import AppShell from "../components/AppShell";
import HowToPlayModal from "../components/HowToPlayModal";
import DarkModeToggle from "../components/DarkModeToggle";
import MailingListButton from "../components/MailingListButton";
import { MediaType } from "./types/MediaType";
import { questions } from "../data/questions";

const formatTimeLeft = (secondsLeft: number) => {
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
};

const getSecondsUntilTomorrow = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((tomorrow.getTime() - now.getTime()) / 1000));
};

const getDateKey = (value = new Date()) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDeterministicIndex = (seed: string, max: number) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % max;
};

const DAILY_CHALLENGE_STORAGE_KEY = "dailyChallengeState";

type DailySummary = {
  status: "unplayed" | "won" | "lost";
  guessesUsed: number;
};

export default function Page() {
  const topBannerSlotId = process.env.NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT;
  const [highScore, setHighScore] = useState<number | null>(null);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isDailyExpanded, setIsDailyExpanded] = useState(false);
  const [dailyHeaderMeta, setDailyHeaderMeta] = useState({ streak: 0, nextInLabel: formatTimeLeft(getSecondsUntilTomorrow()) });
  const [dailySummary, setDailySummary] = useState<DailySummary>({ status: "unplayed", guessesUsed: 0 });
  const dailySectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const parsedHighScore = parseInt(localStorage.getItem("highestScoreSuddenDeath") ?? "0", 10);
    setHighScore(parsedHighScore > 0 ? parsedHighScore : null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncCollapsedState = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("daily") === "0") {
        setIsDailyExpanded(false);
      }
    };

    syncCollapsedState();
    window.addEventListener("popstate", syncCollapsedState);
    return () => window.removeEventListener("popstate", syncCollapsedState);
  }, []);

  const scrollToDaily = () => {
    window.setTimeout(() => {
      dailySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const handleDailyPlayClick = () => {
    if (!isDailyExpanded) {
      setIsDailyExpanded(true);
      scrollToDaily();
      return;
    }

    scrollToDaily();
  };

  const displayDate = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const categoryList = useMemo(() => Object.values(MediaType), []);
  const marqueeCategories = useMemo(() => [...categoryList, ...categoryList], [categoryList]);
  const dailyEmojiPreviewTokens = useMemo(() => {
    const today = getDateKey();
    const index = getDeterministicIndex(today, questions.length);
    return questions[index]?.emoji?.split("/").filter(Boolean) ?? [];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyHeaderMeta((prev) => ({
        ...prev,
        nextInLabel: formatTimeLeft(getSecondsUntilTomorrow()),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const today = getDateKey();

    const syncSummary = () => {
      const raw = localStorage.getItem(DAILY_CHALLENGE_STORAGE_KEY);
      if (!raw) {
        setDailySummary({ status: "unplayed", guessesUsed: 0 });
        return;
      }

      try {
        const parsed = JSON.parse(raw) as {
          dateKey?: string;
          guessesUsed?: number;
          solved?: boolean;
          failed?: boolean;
        };

        if (parsed.dateKey !== today) {
          setDailySummary({ status: "unplayed", guessesUsed: 0 });
          return;
        }

        const baseGuesses = Math.max(0, parsed.guessesUsed ?? 0);

        if (parsed.solved) {
          setDailySummary({ status: "won", guessesUsed: Math.min(3, baseGuesses + 1) });
          return;
        }

        if (parsed.failed) {
          setDailySummary({ status: "lost", guessesUsed: 3 });
          return;
        }

        setDailySummary({ status: "unplayed", guessesUsed: baseGuesses });
      } catch {
        setDailySummary({ status: "unplayed", guessesUsed: 0 });
      }
    };

    syncSummary();
    const interval = window.setInterval(syncSummary, 1200);
    window.addEventListener("focus", syncSummary);
    window.addEventListener("storage", syncSummary);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", syncSummary);
      window.removeEventListener("storage", syncSummary);
    };
  }, []);

  return (
    <>
      <AppShell adSlotId={topBannerSlotId}>
        <section className="tm-hero mx-auto mb-2 w-full max-w-5xl py-2 sm:py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Link href="/?daily=0" onClick={() => setIsDailyExpanded(false)}>
                <img src="/images/triviamojilogo.png" alt="TriviaMoji logo, return to home" className="h-14 w-auto sm:h-16 md:h-[4.5rem]" />
              </Link>
              <p className="text-sm text-slate-600 sm:text-base">Daily Puzzle • {displayDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="tm-pill tm-pill-hover">
                🔥 Streak <span className="tm-pill-number">{dailyHeaderMeta.streak}</span>
              </span>
              <span className="tm-pill tm-pill-hover">
                <span className="tm-stat-label">🕒 Next in</span>{" "}
                <span className="tm-pill-number tm-pill-number-wide tm-stat-value">{dailyHeaderMeta.nextInLabel}</span>
              </span>
              <button type="button" onClick={() => setIsHowToPlayOpen(true)} className="tm-link-chip tm-pill-hover text-sm">
                ❓ How to play
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 lg:grid-cols-10">
          <div className="tm-sd-promo rounded-2xl p-6 pb-8 text-white sm:p-7 sm:pb-9 lg:col-span-7">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">The Ultimate Emoji Gauntlet</div>
            <h2 className="tm-title mt-2 text-4xl text-white sm:text-5xl">☠️ Play Sudden Death ☠️</h2>
            <p className="mt-3 text-lg text-white sm:text-2xl">One wrong guess and your run is <span className="font-bold text-red-600">over.</span></p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/game" className="tm-btn-danger tm-btn-sd-main w-full justify-center text-lg sm:text-xl">
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
            <div className="mt-7">
              <p className="tm-category-count shrink-0 text-center text-base font-semibold sm:text-lg lg:text-left">
                Questions in <span className="tm-category-count-number font-extrabold">{categoryList.length}</span> unique categories!
              </p>
              <div className="tm-category-marquee mt-3">
                <div className="tm-category-track">
                  {marqueeCategories.map((category, index) => (
                    <span key={`${category}-${index}`} className="tm-pill tm-pill-hover tm-marquee-pill">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="tm-daily-card rounded-2xl p-5 lg:col-span-3">
            <div className="tm-daily-kicker text-xs font-semibold uppercase tracking-[0.18em]">Daily Puzzle</div>
            <h3 className="tm-title tm-daily-title mt-1 text-xl sm:text-2xl">Play Daily</h3>
            <div className="tm-daily-preview mt-2 rounded-xl py-4 text-center text-4xl leading-none" aria-label="Today's daily emoji puzzle preview">
              {dailyEmojiPreviewTokens.map((token, index) => (
                <span key={`${token}-${index}`} className="tm-daily-preview-emoji">
                  {token}
                </span>
              ))}
            </div>
            <p className="tm-daily-copy mt-3 text-sm sm:text-base">One puzzle a day. Keep your streak alive.</p>
            {dailySummary.status === "won" && (
              <div className="tm-feedback-correct mt-3 rounded-xl px-3 py-2 text-sm">
                Solved today in {dailySummary.guessesUsed}/3 guesses
              </div>
            )}
            {dailySummary.status === "lost" && (
              <div className="tm-feedback-wrong mt-3 rounded-xl px-3 py-2 text-sm">
                Daily missed today: 3/3 used
              </div>
            )}
            {dailySummary.status === "unplayed" && dailySummary.guessesUsed > 0 && (
              <div className="mt-3 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                In progress: {dailySummary.guessesUsed}/3 guesses used
              </div>
            )}
            <button type="button" className="tm-btn-ghost tm-daily-cta mt-4 w-full justify-center" onClick={handleDailyPlayClick}>
              Play Daily Game
            </button>
            {isDailyExpanded && (
              <button type="button" className="tm-link mt-2 block w-full text-center text-sm" onClick={() => setIsDailyExpanded(false)}>
                Hide Daily Game
              </button>
            )}
          </div>
        </section>

        {isDailyExpanded && (
          <div ref={dailySectionRef}>
            <DailyChallenge onHeaderMetaChange={setDailyHeaderMeta} />
          </div>
        )}

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

      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
    </>
  );
}
