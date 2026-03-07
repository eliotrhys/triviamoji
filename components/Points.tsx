import { useEffect, useState } from "react";
import Guess from "../app/types/Guess";
import PopoverTrigger from "./PopoverTrigger";

interface PointsProps {
  count: number;
  guesses: Guess[];
}

export default function Points(props: PointsProps) {

  const answers = props.guesses.map((guess, index) => 
    guess.isCorrect ? 
    <PopoverTrigger key={index} isCorrect={true} correctAnswer={guess.correctAnswer} correctAnswerEmoji={guess.correctAnswerEmoji} />
    :
    <PopoverTrigger key={index} isCorrect={false} correctAnswer={guess.correctAnswer} correctAnswerEmoji={guess.correctAnswerEmoji} />
  );

  return (
    <div className="min-h-12">
      <div className="flex justify-center flex-wrap">
        { answers }
      </div>
    </div>
  )
}
