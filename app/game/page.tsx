import type { Metadata } from "next";
import GameForm from "../../components/GameForm";

export const metadata: Metadata = {
  title: "Play Emoji Trivia",
  description:
    "Play Triviamoji sudden-death mode and solve emoji trivia puzzles across multiple categories.",
  alternates: {
    canonical: "/game",
  },
};

export default function Page() {
  const isSuddenDeath = true;

  return (
    <div className="w-full">
      <GameForm isSuddenDeath={isSuddenDeath} />
    </div>
  );
}
