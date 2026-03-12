import { useCallback, useRef, useState } from "react";
import Guess from "../app/types/Guess";
import Keyboard from "./Keyboard";
import ConfettiBurst from "./ConfettiBurst";

interface GuessInputProps {
  answer: string;
  answerEmoji: string;
  potentialAnswers: string[];
  guesses: Guess[];
  onGuess: (isCorrect: boolean) => void;
  onGuessesUpdate: (guesses: Guess[]) => void;
  isSuddenDeath?: boolean;
}

export default function GuessInput({ answer, answerEmoji, potentialAnswers, guesses, onGuess, onGuessesUpdate, isSuddenDeath = false }: GuessInputProps) {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const handleSubmit = () => {
    if (guess.trim().length === 0 || isSubmitting) {
      return;
    }

    resetFeedback();

    const lowerCasePotentialAnswers = potentialAnswers.map((entry) => entry.toLowerCase());
    const isCorrect = lowerCasePotentialAnswers.includes(guess.toLowerCase().trimEnd());
    const submittedGuess = guess;
    const feedbackDelayMs = isCorrect ? 0 : isSuddenDeath ? 520 : 180;

    setFeedback(isCorrect ? "correct" : "wrong");
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
    }, 700);
    setIsSubmitting(true);
    setGuess("");

    const commitGuess = () => {
      onGuess(isCorrect);
      const newGuess: Guess = { guess: submittedGuess, isCorrect, correctAnswer: answer, correctAnswerEmoji: answerEmoji };
      onGuessesUpdate([...guesses, newGuess]);
      setIsSubmitting(false);
    };

    if (feedbackDelayMs === 0) {
      commitGuess();
      return;
    }

    window.setTimeout(commitGuess, feedbackDelayMs);
  };

  const handleCurrentWordChange = useCallback((currentWord: string) => {
    setGuess(currentWord);
  }, []);

  return (
    <section className="p-0">
      <div className="relative">
        {feedback && (
          <div className={`tm-feedback-pop tm-feedback-overlay ${feedback === "correct" ? "tm-feedback-correct" : "tm-feedback-wrong"}`}>
            {feedback === "correct" ? "Correct!" : "Not this one, keep going."}
          </div>
        )}
        {feedback === "correct" && <ConfettiBurst />}
        <Keyboard handleCurrentWordChange={handleCurrentWordChange} onEnter={handleSubmit} plainPreview={isSuddenDeath} />
      </div>
    </section>
  );
}
