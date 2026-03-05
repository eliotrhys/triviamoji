import GameForm from "../../components/GameForm";

interface PageProps {
  searchParams: Promise<{
    isSuddenDeath?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const isSuddenDeath = params.isSuddenDeath === "true";

  return (
    <div className="w-full">
      <GameForm isSuddenDeath={isSuddenDeath} />
    </div>
  );
}
