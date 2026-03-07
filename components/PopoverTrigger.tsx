import { useState } from "react";
import Popover from "./Popover";

interface PopoverTriggerProps {
  correctAnswer?: string;
  correctAnswerEmoji?: string;
  isCorrect: boolean;
}

export default function PopoverTrigger(props: PopoverTriggerProps) {

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="popover-trigger"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      { 
        props.isCorrect ? 
        <div className="h-4 w-4 lg:h-8 lg:w-8 my-1 mx-1 lg:my-1 lg:mx-1 border-4 border-black bg-green-500 rounded-full"></div> :
        <div className="h-4 w-4 lg:h-8 lg:w-8 my-1 mx-1 lg:my-1 lg:mx-1 border-4 border-black bg-red-500 rounded-full"></div> 
      }
        

        {isHovering && <Popover correctAnswer={props.correctAnswer} correctAnswerEmoji={props.correctAnswerEmoji} />}
    </div>
  )
}
