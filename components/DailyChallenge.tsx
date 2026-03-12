"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Question from "../app/types/Question";
import { questions } from "../data/questions";
import Keyboard from "./Keyboard";
import GameSurface from "./GameSurface";
import ConfettiBurst from "./ConfettiBurst";

interface PersistedDailyState {
  dateKey: string;
  guessesUsed: number;
  solved: boolean;
  failed: boolean;
  hintUsed?: boolean;
  hintCategory?: boolean;
  hintDashes?: boolean;
  hintLetters?: boolean;
}

interface PersistedStreakState {
  streakCount: number;
  lastWinDate: string;
}

const DAILY_CHALLENGE_STORAGE_KEY = "dailyChallengeState";
const DAILY_STREAK_STORAGE_KEY = "dailyChallengeStreak";
const MAX_DAILY_GUESSES = 3;

const getDateKey = (value = new Date()) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getYesterdayDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return getDateKey(date);
};

const getDeterministicIndex = (seed: string, max: number) => {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return hash % max;
};

const buildHint = (answer: string, dateKey: string, revealCountOverride?: number) => {
  const chars = answer.split("");
  const revealCandidates = chars
    .map((char, index) => ({ char, index }))
    .filter((entry) => /[a-z0-9]/i.test(entry.char));

  if (revealCandidates.length === 0) {
    return answer;
  }

  const revealCount = revealCountOverride ?? (revealCandidates.length > 5 ? 2 : 1);
  const revealed = new Set<number>();
  let seed = getDeterministicIndex(`${dateKey}-${answer}`, 2147483647);

  while (revealed.size < revealCount) {
    seed = (seed * 1103515245 + 12345) % 2147483647;
    const candidateIndex = revealCandidates[seed % revealCandidates.length].index;
    revealed.add(candidateIndex);
  }

  return chars
    .map((char, index) => {
      if (!/[a-z0-9]/i.test(char)) {
        return char;
      }

      return revealed.has(index) ? char : "_";
    })
    .join("");
};

const buildDashHint = (answer: string) =>
  answer
    .split("")
    .map((char) => (/[a-z0-9]/i.test(char) ? "_" : char))
    .join("");

const renderPuzzleSlots = (value: string, boxClass: string) => {
  const tokens = value.split(" ");

  return (
    <div className="mt-2 flex flex-wrap justify-center gap-2 sm:gap-3">
      {tokens.map((token, tokenIndex) => (
        <span key={`${token}-${tokenIndex}`} className="mr-2 inline-flex items-center gap-x-1.5 sm:mr-3">
          {token.split("").map((char, charIndex) => {
            const isAlphaNumeric = /[a-z0-9_]/i.test(char);

            if (!isAlphaNumeric) {
              return (
                <span key={`${char}-${charIndex}`} className="tm-underscore-char tm-underscore-char-symbol text-slate-900">
                  {char.toUpperCase()}
                </span>
              );
            }

            return (
              <span
                key={`${char}-${charIndex}`}
                className={`tm-underscore-char tm-slot-char inline-flex h-11 w-9 items-center justify-center rounded-lg sm:h-12 sm:w-10 ${boxClass}`}
              >
                {char === "_" ? "" : char.toUpperCase()}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

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

const getEmojiRowClass = (count: number) => {
  if (count <= 3) {
    return "tm-emoji-row-few";
  }
  if (count <= 5) {
    return "tm-emoji-row-mid";
  }
  return "tm-emoji-row-many";
};

interface DailyChallengeProps {
  onHeaderMetaChange?: (meta: { streak: number; nextInLabel: string }) => void;
}

export default function DailyChallenge({ onHeaderMetaChange }: DailyChallengeProps) {
  const [dailyQuestion, setDailyQuestion] = useState<Question | null>(null);
  const [dateKey, setDateKey] = useState("");
  const [dailyGuess, setDailyGuess] = useState("");
  const [guessesUsed, setGuessesUsed] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [hintCategory, setHintCategory] = useState(false);
  const [hintDashes, setHintDashes] = useState(false);
  const [hintLetters, setHintLetters] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [secondsUntilTomorrow, setSecondsUntilTomorrow] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const [emojiGridCopyMessage, setEmojiGridCopyMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | null>(null);
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [lastSubmittedGuess, setLastSubmittedGuess] = useState("");
  const [lastGuessWasCorrect, setLastGuessWasCorrect] = useState<boolean | null>(null);
  const latestGuessRef = useRef("");

  useEffect(() => {
    const today = getDateKey();
    const index = getDeterministicIndex(today, questions.length);
    const question = questions[index];

    setDateKey(today);
    setDailyQuestion(question);
    setSecondsUntilTomorrow(getSecondsUntilTomorrow());

    if (typeof window === "undefined") {
      return;
    }

    const storedRaw = localStorage.getItem(DAILY_CHALLENGE_STORAGE_KEY);

    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw) as PersistedDailyState;

        if (parsed.dateKey === today) {
          setGuessesUsed(parsed.guessesUsed);
          setIsSolved(parsed.solved);
          setIsFailed(parsed.failed);
          setHintCategory(Boolean(parsed.hintCategory));
          setHintDashes(Boolean(parsed.hintDashes));
          setHintLetters(Boolean(parsed.hintLetters));
        }
      } catch {
        localStorage.removeItem(DAILY_CHALLENGE_STORAGE_KEY);
      }
    }

    const streakRaw = localStorage.getItem(DAILY_STREAK_STORAGE_KEY);
    if (!streakRaw) {
      return;
    }

    try {
      const parsed = JSON.parse(streakRaw) as PersistedStreakState;
      const yesterday = getYesterdayDateKey(today);
      const stillActive = parsed.lastWinDate === today || parsed.lastWinDate === yesterday;

      if (!stillActive) {
        localStorage.setItem(
          DAILY_STREAK_STORAGE_KEY,
          JSON.stringify({ streakCount: 0, lastWinDate: "" } satisfies PersistedStreakState),
        );
        setStreakCount(0);
        return;
      }

      setStreakCount(parsed.streakCount ?? 0);
    } catch {
      localStorage.removeItem(DAILY_STREAK_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nowDateKey = getDateKey();
      if (dateKey && nowDateKey !== dateKey) {
        window.location.reload();
      }

      setSecondsUntilTomorrow(getSecondsUntilTomorrow());
    }, 1000);

    return () => clearInterval(interval);
  }, [dateKey]);

  const persistState = (nextState: PersistedDailyState) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(DAILY_CHALLENGE_STORAGE_KEY, JSON.stringify(nextState));
  };

  const submitDailyGuess = (guessOverride?: string) => {
    const guessValue = (guessOverride ?? latestGuessRef.current).trimEnd();

    if (!dailyQuestion || isSolved || isFailed || guessValue.trim().length === 0) {
      return;
    }

    const isCorrect = dailyQuestion.acceptableAnswers
      .map((answer) => answer.toLowerCase())
      .includes(guessValue.toLowerCase());

    if (isCorrect) {
      setFeedbackType("correct");
      setFeedbackKey(Date.now());
      setLastSubmittedGuess(guessValue);
      setLastGuessWasCorrect(true);
      let nextStreakCount = 1;
      if (typeof window !== "undefined") {
        const streakRaw = localStorage.getItem(DAILY_STREAK_STORAGE_KEY);
        let streakState: PersistedStreakState = { streakCount: 0, lastWinDate: "" };

        if (streakRaw) {
          try {
            streakState = JSON.parse(streakRaw) as PersistedStreakState;
          } catch {
            streakState = { streakCount: 0, lastWinDate: "" };
          }
        }

        const yesterday = getYesterdayDateKey(dateKey);
        if (streakState.lastWinDate === dateKey) {
          nextStreakCount = Math.max(1, streakState.streakCount || 1);
        } else if (streakState.lastWinDate === yesterday) {
          nextStreakCount = (streakState.streakCount || 0) + 1;
        }

        localStorage.setItem(
          DAILY_STREAK_STORAGE_KEY,
          JSON.stringify({ streakCount: nextStreakCount, lastWinDate: dateKey } satisfies PersistedStreakState),
        );
      }

      setStreakCount(nextStreakCount);
      setIsSolved(true);
      setShareMessage("");
      persistState({
        dateKey,
        guessesUsed,
        solved: true,
        failed: false,
        hintCategory,
        hintDashes,
        hintLetters,
      });
      return;
    }

    const nextGuessesUsed = guessesUsed + 1;
    const nextFailed = nextGuessesUsed >= MAX_DAILY_GUESSES;

    setFeedbackType("wrong");
    setFeedbackKey(Date.now());
    setLastSubmittedGuess(guessValue);
    setLastGuessWasCorrect(false);
    setGuessesUsed(nextGuessesUsed);
    setIsFailed(nextFailed);
    if (nextFailed && typeof window !== "undefined") {
      localStorage.setItem(
        DAILY_STREAK_STORAGE_KEY,
        JSON.stringify({ streakCount: 0, lastWinDate: "" } satisfies PersistedStreakState),
      );
      setStreakCount(0);
    }

    persistState({
      dateKey,
      guessesUsed: nextGuessesUsed,
      solved: false,
      failed: nextFailed,
      hintCategory,
      hintDashes,
      hintLetters,
    });
  };

  const handleCurrentWordChange = useCallback((currentWord: string) => {
    latestGuessRef.current = currentWord;
    setDailyGuess(currentWord);
    if (currentWord.trim().length > 0) {
      setLastGuessWasCorrect(null);
    }
  }, []);

  const activateHint = (hintType: "category" | "dashes" | "letters") => {
    if (isSolved || isFailed) {
      return;
    }

    const nextCategory = hintType === "category" ? true : hintCategory;
    const nextDashes = hintType === "dashes" ? true : hintDashes;
    const nextLetters = hintType === "letters" ? true : hintLetters;

    setHintCategory(nextCategory);
    setHintDashes(nextDashes);
    setHintLetters(nextLetters);
    persistState({
      dateKey,
      guessesUsed,
      solved: isSolved,
      failed: isFailed,
      hintCategory: nextCategory,
      hintDashes: nextDashes,
      hintLetters: nextLetters,
    });
  };

  const shareDailyResult = async () => {
    if (!dailyQuestion || typeof window === "undefined") {
      return;
    }

    const result = isSolved ? `${guessesUsed + 1}/${MAX_DAILY_GUESSES}` : `X/${MAX_DAILY_GUESSES}`;
    const emojiLine = isSolved
      ? "🟩".repeat(Math.min(MAX_DAILY_GUESSES, guessesUsed + 1))
      : `${"🟥".repeat(guessesUsed)}${"⬜".repeat(Math.max(0, MAX_DAILY_GUESSES - guessesUsed))}`;

    const shareText = `TriviaMoji Daily ${dateKey}\n${result}\n${emojiLine}\n${dailyQuestion.emoji.replaceAll("/", "")}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setShareMessage("Result copied to clipboard");
    } catch {
      setShareMessage("Unable to copy right now");
    }
  };

  const copyEmojiGrid = async () => {
    if (!dailyQuestion || typeof window === "undefined") {
      return;
    }

    try {
      await navigator.clipboard.writeText(copyableResult);
      setEmojiGridCopyMessage("Emoji grid copied");
      setTimeout(() => setEmojiGridCopyMessage(""), 1200);
    } catch {
      setEmojiGridCopyMessage("Copy failed");
      setTimeout(() => setEmojiGridCopyMessage(""), 1200);
    }
  };

  const hintPattern = useMemo(() => {
    if (!dailyQuestion) {
      return "";
    }

    if (hintLetters) {
      return buildHint(dailyQuestion.title, dateKey, 2).toUpperCase();
    }

    if (hintDashes) {
      return buildDashHint(dailyQuestion.title);
    }

    return "";
  }, [dailyQuestion, hintLetters, hintDashes, dateKey]);

  const displayPattern = useMemo(() => {
    if (isSolved || isFailed) {
      return dailyQuestion?.title ?? "";
    }

    if (hintPattern) {
      return hintPattern;
    }

    return "";
  }, [hintPattern, isSolved, isFailed, dailyQuestion]);

  const guessMarkers = useMemo(() => {
    const markers: Array<"pending" | "correct" | "wrong"> = [];

    if (isSolved) {
      for (let i = 0; i < guessesUsed; i += 1) {
        markers.push("wrong");
      }
      markers.push("correct");
    } else {
      for (let i = 0; i < guessesUsed; i += 1) {
        markers.push("wrong");
      }
    }

    while (markers.length < MAX_DAILY_GUESSES) {
      markers.push("pending");
    }

    return markers;
  }, [isSolved, guessesUsed]);

  useEffect(() => {
    if (!feedbackType) {
      return;
    }

    const timer = setTimeout(() => setFeedbackType(null), 1200);
    return () => clearTimeout(timer);
  }, [feedbackType]);

  useEffect(() => {
    onHeaderMetaChange?.({ streak: streakCount, nextInLabel: formatTimeLeft(secondsUntilTomorrow) });
  }, [streakCount, secondsUntilTomorrow, onHeaderMetaChange]);

  if (!dailyQuestion) {
    return (
      <section className="tm-card mb-4 p-5 sm:p-6" aria-live="polite">
        <div className="tm-loading h-5 w-24" />
        <div className="tm-loading mt-4 h-16 w-full" />
        <div className="tm-loading mt-4 h-12 w-full" />
      </section>
    );
  }

  const dailyEmojiTokens = dailyQuestion.emoji.split("/").filter((token) => token !== "");
  const emojiRowClass = getEmojiRowClass(dailyEmojiTokens.length);
  const guessDisplayText = dailyGuess.trim().length > 0 ? dailyGuess : lastSubmittedGuess;
  const guessDisplayClass =
    isSolved || lastGuessWasCorrect === true
      ? "tm-live-guess-correct"
      : isFailed || lastGuessWasCorrect === false
        ? "tm-live-guess-wrong"
        : "";
  const displayPatternClass = isSolved ? "tm-slot-success" : isFailed ? "tm-slot-fail" : "tm-slot-neutral";
  const shareScoreLine = isSolved ? `${guessesUsed + 1}/${MAX_DAILY_GUESSES}` : `X/${MAX_DAILY_GUESSES}`;
  const shareSquares = isSolved ? "🟩".repeat(Math.min(MAX_DAILY_GUESSES, guessesUsed + 1)) : "🟥".repeat(MAX_DAILY_GUESSES);
  const shareEmojiLine = dailyQuestion.emoji.replaceAll("/", "");
  const copyableResult = `TriviaMoji Daily ${dateKey}\n${shareScoreLine}\n${shareSquares}\n${shareEmojiLine}`;

  return (
    <GameSurface
      mode="daily"
      className="mb-6"
      hintsRow={
        !isSolved && !isFailed ? (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="tm-meta-label">Hints</span>
            <button type="button" onClick={() => activateHint("category")} disabled={hintCategory || isSolved || isFailed} className="tm-pill tm-pill-action">
              Show category
            </button>
            <button type="button" onClick={() => activateHint("dashes")} disabled={hintDashes || isSolved || isFailed} className="tm-pill tm-pill-action">
              Show dashes only
            </button>
            <button type="button" onClick={() => activateHint("letters")} disabled={hintLetters || isSolved || isFailed} className="tm-pill tm-pill-action">
              Reveal 2 letters
            </button>
          </div>
        ) : undefined
      }
      categoryRow={
        hintCategory || isSolved ? (
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="tm-meta-label">Category</span>
            <span className="tm-pill tm-pill-primary tm-pill-hover tm-pill-category">{dailyQuestion.mediaType}</span>
          </div>
        ) : undefined
      }
      emojiRow={
        <div className={`tm-emoji-row ${emojiRowClass}`}>
          {dailyEmojiTokens.map((token, index) => (
            <span key={`${token}-${index}`} className="tm-emoji-char">
              {token}
            </span>
          ))}
        </div>
      }
      guessesRow={
        <div className="mt-4 flex items-center justify-center">
          <span className="tm-pill tm-pill-hover">
            <span className="tm-meta-label mr-2">Guesses</span>
            <span className="tm-guess-markers">
              {guessMarkers.map((marker, index) => (
                <span key={index} className={`tm-guess-dot tm-guess-dot-${marker}`}>
                  {marker === "correct" ? "✓" : marker === "wrong" ? "×" : ""}
                </span>
              ))}
            </span>
          </span>
        </div>
      }
      guessDisplay={
        !isSolved && !isFailed ? (
          <div className="tm-live-guess-wrap relative">
            {feedbackType && (
              <div key={feedbackKey} className={`tm-feedback-pop tm-feedback-overlay ${feedbackType === "correct" ? "tm-feedback-correct" : "tm-feedback-wrong"}`}>
                {feedbackType === "correct" ? "Correct!" : "Wrong!"}
              </div>
            )}
            {feedbackType === "correct" && <ConfettiBurst />}
            <div className="tm-live-guess">
              {guessDisplayText.trim().length > 0 ? (
                <span className={guessDisplayClass}>{guessDisplayText.toUpperCase()}</span>
              ) : (
                <span className="tm-live-placeholder">just start typing your guess!</span>
              )}
            </div>
          </div>
        ) : undefined
      }
      patternRow={displayPattern ? renderPuzzleSlots(displayPattern, displayPatternClass) : undefined}
      inputArea={
        !isSolved && !isFailed ? (
          <div className="mt-5 pt-1">
            <Keyboard handleCurrentWordChange={handleCurrentWordChange} onEnter={() => submitDailyGuess(latestGuessRef.current)} showPreview={false} />
            <div className="mt-3 text-center text-sm text-slate-500">Press Enter on the keyboard to submit</div>
          </div>
        ) : undefined
      }
      resultArea={
        isSolved || isFailed ? (
          <>
            <div className={`tm-result-banner tm-result-chip tm-solved-panel mt-5 ${isSolved ? "tm-result-success" : "tm-result-fail"}`}>
              {isSolved ? "🎉 Puzzle Solved! Amazing work. See you tomorrow." : `😵 Out of guesses. Answer: ${dailyQuestion.title}.`}
            </div>

            <div className="tm-copy-block mx-auto mt-3 w-full max-w-md rounded-xl border border-[#d9e2ef] bg-[#f8fbff] px-3 py-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Copy Result</span>
                <button type="button" className="tm-btn-copy-icon" onClick={copyEmojiGrid} aria-label="Copy emoji grid">
                  📋
                </button>
              </div>
              <pre className="mt-1 whitespace-pre-wrap text-left text-base font-medium leading-6">{copyableResult}</pre>
              {emojiGridCopyMessage && <div className="tm-copy-popover tm-feedback-correct">{emojiGridCopyMessage}</div>}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={shareDailyResult} className="tm-btn-share">
                ↗ Share Result
              </button>
              <button type="button" onClick={shareDailyResult} className="tm-btn-copy">
                ⧉ Copy Score
              </button>
              {shareMessage && <span className="tm-pill">{shareMessage}</span>}
            </div>
          </>
        ) : undefined
      }
    />
  );
}
