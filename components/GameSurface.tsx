import { ReactNode } from "react";

interface GameSurfaceProps {
  mode: "daily" | "suddenDeath";
  topRow?: ReactNode;
  hintsRow?: ReactNode;
  categoryRow?: ReactNode;
  emojiRow: ReactNode;
  guessesRow: ReactNode;
  guessDisplay?: ReactNode;
  patternRow?: ReactNode;
  inputArea?: ReactNode;
  resultArea?: ReactNode;
  className?: string;
}

export default function GameSurface({
  mode,
  topRow,
  hintsRow,
  categoryRow,
  emojiRow,
  guessesRow,
  guessDisplay,
  patternRow,
  inputArea,
  resultArea,
  className = "",
}: GameSurfaceProps) {
  return (
    <section className={`tm-game-surface mx-auto mb-8 w-full max-w-5xl ${className}`}>
      <div className="tm-card tm-game-surface-card relative mt-4 p-5 text-center sm:p-6">

        {(topRow || hintsRow) && (
          <div className="tm-divider mb-5 border-b pb-4">
            {topRow}
            {hintsRow}
          </div>
        )}

        {categoryRow}
        {emojiRow}
        {guessesRow}
        {guessDisplay}
        {patternRow}
        {inputArea}
        {resultArea}
      </div>
    </section>
  );
}
