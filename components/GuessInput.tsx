import { useCallback, useEffect, useState } from "react";
import Guess from "../app/types/Guess";
import Keyboard from "./Keyboard";

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

  const resetFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  useEffect(() => {
    resetFeedback();
  }, [answer, resetFeedback]);

  const handleSubmit = () => {
    if (guess.trim().length === 0) {
      return;
    }

    resetFeedback();

    const lowerCasePotentialAnswers = potentialAnswers.map((entry) => entry.toLowerCase());
    const isCorrect = lowerCasePotentialAnswers.includes(guess.toLowerCase().trimEnd());

    onGuess(isCorrect);
    const newGuess: Guess = { guess, isCorrect, correctAnswer: answer, correctAnswerEmoji: answerEmoji };
    onGuessesUpdate([...guesses, newGuess]);
    setFeedback(isCorrect ? "correct" : "wrong");
    setGuess("");
  };

  const handleCurrentWordChange = useCallback((currentWord: string) => {
    setGuess(currentWord);
  }, []);

  return (
    <section className="p-0">
      {feedback && (
        <div className={`tm-result-banner mb-3 ${feedback === "correct" ? "tm-result-success" : "tm-result-fail"}`}>
          {feedback === "correct" ? "Correct!" : "Not this one, keep going."}
        </div>
      )}
      <Keyboard handleCurrentWordChange={handleCurrentWordChange} onEnter={handleSubmit} plainPreview={isSuddenDeath} />
    </section>
  );
}
