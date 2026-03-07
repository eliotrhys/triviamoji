"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Question from "../app/types/Question";
import { questions } from "../data/questions";

interface PersistedDailyState {
  dateKey: string;
  guessesUsed: number;
  solved: boolean;
  failed: boolean;
  hintUsed: boolean;
}

const DAILY_CHALLENGE_STORAGE_KEY = "dailyChallengeState";
const MAX_DAILY_GUESSES = 3;

const getDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
  return (
    <div className="mb-4 flex justify-center flex-wrap gap-x-1 gap-y-2">
      {value.split("").map((char, index) => {
        if (char === " ") {
          return <span key={`${char}-${index}`} className="w-3 lg:w-4" />;
        }

        const isAlphaNumeric = /[a-z0-9_]/i.test(char);

        if (!isAlphaNumeric) {
          return (
            <span key={`${char}-${index}`} className={`text-lg lg:text-2xl ${textColorClass}`}>
              {char}
            </span>
          );
        }

        return (
          <span
            key={`${char}-${index}`}
            className={`inline-flex items-end justify-center w-4 lg:w-6 h-7 lg:h-9 border-b-4 border-black text-lg lg:text-2xl ${textColorClass}`}
          >
            {char === "_" ? "" : char}
          </span>
        );
      })}
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
  }, []);

  const persistState = (nextState: PersistedDailyState) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(DAILY_CHALLENGE_STORAGE_KEY, JSON.stringify(nextState));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!dailyQuestion || isSolved || isFailed || dailyGuess.trim().length === 0) {
      return;
    }

    setShowCorrectImage(false);
    setShowWrongImage(false);

    const isCorrect = dailyQuestion.acceptableAnswers
      .map((answer) => answer.toLowerCase())
      .includes(dailyGuess.toLowerCase().trimEnd());

    if (isCorrect) {
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
      return;
    }

    const nextGuessesUsed = guessesUsed + 1;
    const nextFailed = nextGuessesUsed >= MAX_DAILY_GUESSES;

    setGuessesUsed(nextGuessesUsed);
    setIsFailed(nextFailed);
    setShowWrongImage(true);
    setAnimationKey(Date.now());
    setDailyGuess("");

    persistState({
      dateKey,
      guessesUsed: nextGuessesUsed,
      solved: false,
      failed: nextFailed,
      hintUsed,
    });
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
      <div className="bg-white border-4 border-black rounded-lg p-4 lg:p-6 text-center relative">

        <h3 className="text-lg lg:text-2xl mb-2">Play Your Daily Challenge</h3>
        <div className="w-full border-b-4 border-black mb-4" />
        <div className="text-sm lg:text-lg text-center border-4 border-emerald-600 text-emerald-600 bg-emerald-100 px-4 inline-block rounded-md p-1 mb-4 menuMediaType">
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
              <input
                type="text"
                value={dailyGuess}
                onChange={(event) => setDailyGuess(event.target.value)}
                placeholder="Type your answer"
                disabled={isSolved || isFailed}
                className="w-full sm:w-4/5 lg:w-3/4 mx-auto border-4 border-black rounded-full px-4 py-3 text-center mb-3 disabled:opacity-60 block"
              />
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
          <div className="mt-3">
            <div className="text-5xl mb-1">👍</div>
            <div className="text-green-600 font-bold">Nice!</div>
          </div>
        )}
        {isFailed && (
          <div className="mt-3">
            <div className="text-5xl mb-1">☠️</div>
            <div className="text-red-600 font-bold">Oof.</div>
          </div>
        )}

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
      </div>
    </div>
  );
}
