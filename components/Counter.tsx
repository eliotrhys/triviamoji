interface CounterProps {
  count: number;
  isSuddenDeath: boolean;
}

export default function Counter({ count, isSuddenDeath }: CounterProps) {
  return <div className="tm-pill tm-pill-primary">{isSuddenDeath ? `Score ${count}` : `Question ${count + 1}`}</div>;
}
