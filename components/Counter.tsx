interface CounterProps {
  count: number;
  isSuddenDeath: boolean;
}

export default function Counter({ count, isSuddenDeath }: CounterProps) {
  return (
    <div className="tm-pill tm-pill-primary tm-pill-hover">
      {isSuddenDeath ? "Score" : "Question"}
      <span className="tm-pill-number">{isSuddenDeath ? count : count + 1}</span>
    </div>
  );
}
