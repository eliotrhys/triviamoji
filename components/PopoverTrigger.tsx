import { useState } from "react";
import Popover from "./Popover";

interface PopoverTriggerProps {
  correctAnswer?: string;
  correctAnswerEmoji?: string;
  isCorrect: boolean;
}

export default function PopoverTrigger({ correctAnswer, correctAnswerEmoji, isCorrect }: PopoverTriggerProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <div className={`tm-guess-dot ${isCorrect ? "tm-guess-dot-correct" : "tm-guess-dot-wrong"}`} />
      {isHovering && <Popover correctAnswer={correctAnswer} correctAnswerEmoji={correctAnswerEmoji} />}
    </div>
  );
}
