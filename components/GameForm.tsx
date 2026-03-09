"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Counter from "./Counter";
import EmojiDisplay from "./EmojiDisplay";
import GuessInput from "./GuessInput";
import Countdown from "./Countdown";
import Points from "./Points";
import CongratulationsScreen from "./CongratulationsScreen";
import SideMenu from "./SideMenu";
import IntroScreen from "./IntroScreen";
import Navbar from "./Navbar";

import { questions } from "../data/questions";
import shuffle from "../app/utils/shuffle";

import Question from "../app/types/Question";
import Guess from "../app/types/Guess";
import { MediaType } from "../app/types/MediaType";

interface GameFormProps {
  isSuddenDeath: boolean;
}

export default function GameForm({ isSuddenDeath }: GameFormProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [count, setCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [acceptableAnswers, setAcceptableAnswers] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [lastIncorrectAnswer, setLastIncorrectAnswer] = useState("");
  const [lastIncorrectEmoji, setLastIncorrectEmoji] = useState("");

  const [timeRemaining, setTimeRemaining] = useState(60);
  const [introTimeRemaining, setIntroTimeRemaining] = useState(3);
  const [showIntroScreen, setShowIntroScreen] = useState(true);
  const [showFailureAd, setShowFailureAd] = useState(false);
  const [showCongratulationsScreen, setShowCongratulationsScreen] = useState(false);

  const [highestScore, setHighestScore] = useState<number>(typeof window !== "undefined" ? parseInt(localStorage.getItem("highestScore") ?? "0", 10) : 0);
  const [highestScoreSuddenDeath, setHighestScoreSuddenDeath] = useState<number>(
    typeof window !== "undefined" ? parseInt(localStorage.getItem("highestScoreSuddenDeath") ?? "0", 10) : 0,
  );

  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-GB", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  const finalizeGame = useCallback(() => {
    if (typeof window !== "undefined") {
      const completedGames = parseInt(localStorage.getItem("completedGamesCount") ?? "0", 10);
      setShowFailureAd(completedGames >= 1);
      localStorage.setItem("completedGamesCount", `${completedGames + 1}`);
    }

    setShowCongratulationsScreen(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let savedCheckedItems = JSON.parse(localStorage.getItem("checkedItems") || "[]") as MediaType[];

      if (savedCheckedItems.length === 0) {
        savedCheckedItems = [MediaType.NationFlag];
        localStorage.setItem("checkedItems", JSON.stringify(savedCheckedItems));
      }

      const filteredQuestions = questions.filter((question) => !savedCheckedItems.includes(question.mediaType as MediaType));
      setShuffledQuestions(shuffle(filteredQuestions));
    }
  }, []);

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      setTitle(shuffledQuestions[questionIndex].title);
      setEmoji(shuffledQuestions[questionIndex].emoji);
      setMediaType(shuffledQuestions[questionIndex].mediaType);
      setAcceptableAnswers(shuffledQuestions[questionIndex].acceptableAnswers);
    }
  }, [questionIndex, shuffledQuestions]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (isSuddenDeath) {
      if (correctCount > highestScoreSuddenDeath) {
        setHighestScoreSuddenDeath(correctCount);
        localStorage.setItem("highestScoreSuddenDeath", `${correctCount}`);
      }
    } else if (correctCount > highestScore) {
      setHighestScore(correctCount);
      localStorage.setItem("highestScore", `${correctCount}`);
    }
  }, [correctCount, highestScore, highestScoreSuddenDeath, isSuddenDeath]);

  const handleGuess = (isCorrect: boolean) => {
    setCount((prevCount) => prevCount + 1);

    const newGuess: Guess = { guess: title, isCorrect };

    if (newGuess.isCorrect) {
      setCorrectCount((prevCount) => prevCount + 1);
    }

    if (questionIndex === shuffledQuestions.length - 1) {
      finalizeGame();
    } else if (isSuddenDeath && !newGuess.isCorrect) {
      setLastIncorrectAnswer(title);
      setLastIncorrectEmoji(emoji);
      finalizeGame();
    } else {
      setQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleGuessUpdate = useCallback((updatedGuesses: Guess[]) => {
    setGuesses(updatedGuesses);
  }, []);

  const handleRestart = () => {
    setCount(0);
    setCorrectCount(0);
    setQuestionIndex(0);
    setGuesses([]);
    setShowFailureAd(false);
    setLastIncorrectAnswer("");
    setLastIncorrectEmoji("");
    setShowCongratulationsScreen(false);

    if (typeof window !== "undefined") {
      let savedCheckedItems = JSON.parse(localStorage.getItem("checkedItems") || "[]") as MediaType[];

      if (savedCheckedItems.length === 0) {
        savedCheckedItems = [MediaType.NationFlag];
        localStorage.setItem("checkedItems", JSON.stringify(savedCheckedItems));
      }

      const filteredQuestions = questions.filter((question) => !savedCheckedItems.includes(question.mediaType as MediaType));
      setShuffledQuestions(shuffle(filteredQuestions));
    }

    setIsMenuOpen(false);
    setShowIntroScreen(true);
  };

  const handleCountdownFinish = () => {
    finalizeGame();
  };

  const handleIntroCountdownFinish = () => {
    setShowIntroScreen(false);
    setIntroTimeRemaining(3);
    setTimeRemaining(60);
  };

  const handleTimeTick = () => {
    if (!isSuddenDeath) {
      setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
    }
  };

  const handleIntroTimeTick = () => {
    setIntroTimeRemaining((prevIntroTimeRemaining) => prevIntroTimeRemaining - 1);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const handleCheckboxChange = (checkedItems: MediaType[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
    }
  };

  return (
    <div className="w-full">
      <SideMenu isOpen={isMenuOpen} onMenuToggle={handleMenuToggle} onCheckboxChange={handleCheckboxChange} />

      <Navbar onMenuToggle={handleMenuToggle} modeLabel={isSuddenDeath ? "Sudden Death" : "Timed Game"} dateLabel={dateLabel} />

      {showCongratulationsScreen ? (
        <CongratulationsScreen
          onRestart={handleRestart}
          count={count}
          guesses={guesses}
          finalScore={guesses.filter((guess) => guess.isCorrect).length}
          isSuddenDeath={isSuddenDeath}
          lastIncorrectAnswer={lastIncorrectAnswer}
          lastIncorrectEmoji={lastIncorrectEmoji}
          showFailureAd={showFailureAd}
        />
      ) : showIntroScreen ? (
        <IntroScreen introTimeRemaining={introTimeRemaining} onIntroTimeTick={handleIntroTimeTick} onCountdownFinish={handleIntroCountdownFinish} isSuddenDeath={isSuddenDeath} />
      ) : (
        <main className="mx-auto w-full max-w-5xl space-y-4">
          <section className={`tm-card p-5 sm:p-6 ${isSuddenDeath ? "tm-sd-surface" : ""}`}>
            {isSuddenDeath && (
              <>
                <div className="tm-sd-emoji tm-sd-emoji-a" aria-hidden="true">
                  ⚡
                </div>
                <div className="tm-sd-emoji tm-sd-emoji-b" aria-hidden="true">
                  😈
                </div>
                <div className="tm-sd-emoji tm-sd-emoji-c" aria-hidden="true">
                  ☠️
                </div>
                <div className="tm-sd-emoji tm-sd-emoji-d" aria-hidden="true">
                  🎯
                </div>
              </>
            )}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 border-b border-[#dfdfda] pb-4">
              <span className="tm-pill">{isSuddenDeath ? "⚡ Sudden Death" : "🕒 Timed Game"}</span>
              <Counter count={count} isSuddenDeath={isSuddenDeath} />
              {!isSuddenDeath && <Countdown timeRemaining={timeRemaining} onTimeTick={handleTimeTick} onCountdownFinish={handleCountdownFinish} />}
            </div>

            <EmojiDisplay emoji={emoji} mediaType={mediaType} framed={!isSuddenDeath} />

            {isSuddenDeath ? (
              <div className="mt-3 flex flex-col items-center justify-center gap-1">
                <span className="tm-meta-label">Guesses</span>
                <Points count={count} guesses={guesses} pendingCount={1} />
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="tm-meta-label">Guesses</span>
                <Points count={count} guesses={guesses} />
              </div>
            )}

            <div className="mt-4">
              <GuessInput
                answer={title}
                answerEmoji={emoji}
                potentialAnswers={acceptableAnswers}
                onGuess={handleGuess}
                onGuessesUpdate={handleGuessUpdate}
                guesses={guesses}
                isSuddenDeath={isSuddenDeath}
              />
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
