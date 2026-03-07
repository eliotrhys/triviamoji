import GameForm from "../../components/GameForm";

export default function Page() {
  const isSuddenDeath = true;

  return (
    <div className="w-full">
      <GameForm isSuddenDeath={isSuddenDeath} />
    </div>
  );
}
