"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Question from "../app/types/Question";
import { questions } from "../data/questions";

interface PersistedDailyState {
  dateKey: string;
  guessesUsed: number;
  solved: boolean;
  failed: boolean;
  hintUsed: boolean;
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

const buildHint = (answer: string, dateKey: string) => {
  const chars = answer.split("");
  const revealCandidates = chars
    .map((char, index) => ({ char, index }))
    .filter((entry) => /[a-z0-9]/i.test(entry.char));

  if (revealCandidates.length === 0) {
    return answer;
  }

  const revealCount = revealCandidates.length > 5 ? 2 : 1;
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

const renderPuzzleSlots = (value: string, textColorClass: string) => {
  const tokens = value.split(" ");

  return (
    <div className="mb-4 flex justify-center flex-wrap gap-y-4 lg:gap-y-5">
      {tokens.map((token, tokenIndex) => (
        <span key={`${token}-${tokenIndex}`} className="inline-flex items-end gap-x-1 mr-4 lg:mr-6">
          {token.split("").map((char, charIndex) => {
            const isAlphaNumeric = /[a-z0-9_]/i.test(char);

            if (!isAlphaNumeric) {
              return (
                <span key={`${char}-${charIndex}`} className={`text-lg lg:text-2xl ${textColorClass}`}>
                  {char}
                </span>
              );
            }

            return (
              <span
                key={`${char}-${charIndex}`}
                className={`inline-flex items-end justify-center w-4 lg:w-6 h-7 lg:h-9 border-b-4 border-black text-lg lg:text-2xl ${textColorClass}`}
              >
                {char === "_" ? "" : char}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

export default function DailyChallenge() {
  const [dailyQuestion, setDailyQuestion] = useState<Question | null>(null);
  const [dateKey, setDateKey] = useState("");
  const [dailyGuess, setDailyGuess] = useState("");
  const [guessesUsed, setGuessesUsed] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [showCorrectImage, setShowCorrectImage] = useState(false);
  const [showWrongImage, setShowWrongImage] = useState(false);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const [streakCount, setStreakCount] = useState(0);
  const editableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const today = getDateKey();
    const index = getDeterministicIndex(today, questions.length);
    const question = questions[index];

    setDateKey(today);
    setDailyQuestion(question);

    if (typeof window === "undefined") {
      return;
    }

    const storedRaw = localStorage.getItem(DAILY_CHALLENGE_STORAGE_KEY);

    if (!storedRaw) {
      return;
    }

    try {
      const parsed = JSON.parse(storedRaw) as PersistedDailyState;

      if (parsed.dateKey !== today) {
        return;
      }

      setGuessesUsed(parsed.guessesUsed);
      setIsSolved(parsed.solved);
      setIsFailed(parsed.failed);
      setHintUsed(parsed.hintUsed);
    } catch {
      localStorage.removeItem(DAILY_CHALLENGE_STORAGE_KEY);
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
    }, 60000);

    return () => clearInterval(interval);
  }, [dateKey]);

  useEffect(() => {
    if (isSolved || isFailed) {
      return;
    }

    let attempts = 0;
    const tryFocus = () => {
      editableRef.current?.focus();
      attempts += 1;

      if (document.activeElement !== editableRef.current && attempts < 12) {
        setTimeout(tryFocus, 120);
      }
    };

    setTimeout(tryFocus, 0);
  }, [isSolved, isFailed, dailyQuestion]);

  const persistState = (nextState: PersistedDailyState) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(DAILY_CHALLENGE_STORAGE_KEY, JSON.stringify(nextState));
  };

  const submitDailyGuess = () => {
    if (!dailyQuestion || isSolved || isFailed || dailyGuess.trim().length === 0) {
      return;
    }

    setShowCorrectImage(false);
    setShowWrongImage(false);

    const isCorrect = dailyQuestion.acceptableAnswers
      .map((answer) => answer.toLowerCase())
      .includes(dailyGuess.toLowerCase().trimEnd());

    if (isCorrect) {
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
      setShowCorrectImage(true);
      setAnimationKey(Date.now());

      persistState({
        dateKey,
        guessesUsed,
        solved: true,
        failed: false,
        hintUsed,
      });
      setDailyGuess("");
      if (editableRef.current) {
        editableRef.current.textContent = "";
      }
      return;
    }

    const nextGuessesUsed = guessesUsed + 1;
    const nextFailed = nextGuessesUsed >= MAX_DAILY_GUESSES;

    setGuessesUsed(nextGuessesUsed);
    setIsFailed(nextFailed);
    setShowWrongImage(true);
    setAnimationKey(Date.now());
    setDailyGuess("");
    if (editableRef.current) {
      editableRef.current.textContent = "";
    }

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
      hintUsed,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitDailyGuess();
  };

  const handleHintClick = () => {
    if (!dailyQuestion || hintUsed || isSolved || isFailed) {
      return;
    }

    setHintUsed(true);
    persistState({
      dateKey,
      guessesUsed,
      solved: isSolved,
      failed: isFailed,
      hintUsed: true,
    });
  };

  const hintText = useMemo(() => {
    if (!dailyQuestion || !hintUsed) {
      return null;
    }

    return buildHint(dailyQuestion.title, dateKey);
  }, [dailyQuestion, hintUsed, dateKey]);

  const puzzleText = useMemo(() => {
    if (!dailyQuestion) {
      return "";
    }

    if (isSolved) {
      return dailyQuestion.title;
    }

    if (isFailed) {
      return dailyQuestion.title;
    }

    return hintText ?? "";
  }, [dailyQuestion, hintText, isFailed, isSolved]);

  if (!dailyQuestion) {
    return null;
  }

  return (
    <div className="w-full lg:w-1/2 xl:w-2/5 mx-auto mb-8">
      <div className="bg-white border-4 border-black rounded-lg relative overflow-hidden">
        <div className="text-center px-4 lg:px-6 pt-4 lg:pt-6 pb-3">
          <h3 className="text-lg lg:text-2xl">Play Your Daily Challenge</h3>
          {streakCount > 0 && (
            <div className="text-xs lg:text-sm text-slate-500 mt-1">your daily streak is {streakCount}</div>
          )}
        </div>
        <div className="w-full border-b-4 border-black" />

        <div className="p-4 lg:p-6 text-center">
          <div className="text-sm lg:text-lg text-center border-4 border-purple-600 text-purple-600 bg-purple-100 px-4 inline-block rounded-md p-1 mb-4 menuMediaType">
            {dailyQuestion.mediaType}
          </div>
          <div className="text-4xl lg:text-6xl mb-4">{dailyQuestion.emoji.replaceAll("/", "")}</div>

          {puzzleText && (
            renderPuzzleSlots(puzzleText, isSolved ? "text-green-600" : isFailed ? "text-red-600" : "text-black")
          )}

          <div className="relative">
            {showCorrectImage && (
              <div className="absolute -top-16 right-2 lg:-top-20 lg:-right-6 pointer-events-none">
                <div key={animationKey} className="relative bloom">
                  <img src="/images/greenBubble.svg" alt="green bubble" className="h-20 lg:h-26 z-10" />
                  <img src="/images/greenTail.svg" alt="green tail" className="h-20 lg:h-26 z-10 absolute bottom-0 -left-10" />
                  <div className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">Correct!</div>
                </div>
              </div>
            )}
            {showWrongImage && (
              <div className="absolute -top-16 right-2 lg:-top-20 lg:-right-6 pointer-events-none">
                <div key={animationKey} className="relative bloom">
                  <img src="/images/redBubble.svg" alt="red bubble" className="h-20 lg:h-26 z-10" />
                  <img src="/images/redTail.svg" alt="red tail" className="h-20 lg:h-26 z-10 absolute bottom-0 -left-10" />
                  <div className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">Wrong!</div>
                </div>
              </div>
            )}

            {!isFailed && !isSolved && (
              <form onSubmit={handleSubmit}>
                <div className="w-full sm:w-4/5 lg:w-3/4 mx-auto border-4 border-black rounded-full px-4 py-3 text-center text-lg lg:text-2xl mb-3 block relative bg-white">
                  <div
                    ref={editableRef}
                    role="textbox"
                    aria-label="Daily challenge answer"
                    contentEditable={!isSolved && !isFailed}
                    suppressContentEditableWarning
                    onInput={(event) => {
                      const nextValue = (event.currentTarget.textContent ?? "").replace(/\n/g, "");
                      setDailyGuess(nextValue);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        submitDailyGuess();
                      }
                    }}
                    className="outline-none leading-tight min-h-[1.5rem]"
                  />
                  {dailyGuess.trim().length === 0 && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-400 text-lg lg:text-2xl">
                      Start Typing!
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSolved || isFailed}
                  className="w-full sm:w-4/5 lg:w-3/4 mx-auto border-4 border-black bg-blue-500 hover:bg-blue-700 text-white rounded-full py-3 disabled:opacity-60 block"
                >
                  Submit Guess
                </button>
              </form>
            )}
          </div>

          {isSolved && (
            <div className="mt-3 inline-flex items-center gap-3">
              <div className="border-4 border-green-600 bg-green-100 text-green-700 rounded-lg py-2 px-4 inline-flex items-center gap-2">
                <span className="text-2xl">👍</span>
                <span className="font-bold">Nice - you got it!</span>
              </div>
              <span className="text-xs lg:text-sm text-slate-400">your daily streak is {streakCount}</span>
            </div>
          )}
          {isFailed && (
            <div className="mt-3 inline-flex flex-col items-center gap-2">
              <div className="border-4 border-red-600 bg-red-100 text-red-700 rounded-lg py-2 px-4 inline-flex items-center gap-2">
                <span className="text-2xl">☠️</span>
                <span className="font-bold">Oof. Better luck next time!</span>
              </div>
              <span className="text-xs lg:text-sm text-slate-400">your daily streak is {streakCount} - see you tomorrow!</span>
            </div>
          )}

          {!isSolved && !isFailed && (
            <div className="flex items-center justify-between text-xs lg:text-sm text-slate-400 mt-4">
              <button
                type="button"
                onClick={handleHintClick}
                disabled={hintUsed || isSolved || isFailed}
                className="underline disabled:opacity-50"
              >
                give me a hint
              </button>
              <span>{Math.max(0, MAX_DAILY_GUESSES - guessesUsed)} guesses remaining</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
