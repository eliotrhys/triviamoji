import { useEffect } from "react";

interface CountdownProps {
  timeRemaining: number;
  onCountdownFinish: () => void;
  onTimeTick: () => void;
}

export default function Countdown({ timeRemaining, onCountdownFinish, onTimeTick }: CountdownProps) {
  useEffect(() => {
    const timer = setInterval(() => {
      onTimeTick();
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeTick]);

  useEffect(() => {
    if (timeRemaining === 0) {
      onCountdownFinish();
    }
  }, [onCountdownFinish, timeRemaining]);

  return <div className={`tm-pill ${timeRemaining < 11 ? "tm-pill-danger" : ""}`}>⏰ {timeRemaining}s</div>;
}
