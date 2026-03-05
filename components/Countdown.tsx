import { useEffect } from "react";

interface CountdownProps {
    timeRemaining: number,
    onCountdownFinish: () => void,
    onTimeTick: () => void
}

export default function Countdown(props: CountdownProps) {
    const { timeRemaining, onCountdownFinish, onTimeTick } = props;
    const danger = timeRemaining < 11 && timeRemaining > 0;

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            onTimeTick();
        }, 1000);
    
        return () => clearInterval(timer);
      }, [onTimeTick]);
    
      // Finish & 10 second warning
      useEffect(() => {
        if (timeRemaining === 0) {
            onCountdownFinish();
        }
      }, [onCountdownFinish, timeRemaining]);
      
    return (
        <div className="">
            <div className={"text-md lg:text-2xl py-1 lg:py-2 text-center border-4 border-black rounded-full flex items-center justify-center mx-auto w-full lift " + (danger ? "bg-red-500 text-white danger-pulse" : "bg-white text-black")}>
                <span className="rotate-[-25deg] mr-2">⏰</span>
                {timeRemaining}
            </div>
        </div>
    )
  }
