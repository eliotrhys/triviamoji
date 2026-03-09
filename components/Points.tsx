import Guess from "../app/types/Guess";
import PopoverTrigger from "./PopoverTrigger";

interface PointsProps {
  count: number;
  guesses: Guess[];
  pendingCount?: number;
}

export default function Points({ guesses, pendingCount = 0 }: PointsProps) {
  return (
    <div className="flex min-h-6 items-center justify-center gap-1">
      {guesses.map((guess, index) => (
        <PopoverTrigger key={`${guess.guess}-${index}`} isCorrect={guess.isCorrect} correctAnswer={guess.correctAnswer} correctAnswerEmoji={guess.correctAnswerEmoji} />
      ))}
      {Array.from({ length: pendingCount }).map((_, index) => (
        <div key={`pending-${index}`} className="relative">
          <span className="tm-guess-dot tm-guess-dot-pending" aria-label="Pending guess" />
        </div>
      ))}
    </div>
  );
}
