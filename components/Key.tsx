import { useState } from "react";

interface KeyProps {
  letter: string;
  onClick: (letter: string) => void;
  keyIsActive: boolean;
  pressedKey: string;
  isFullWidth: boolean;
}

export default function Key({ letter, onClick, keyIsActive, pressedKey, isFullWidth }: KeyProps) {
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsActive(true);
    onClick(letter);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsActive(false);
  };

  const isSpacebar = letter === " " || letter === "SPACE";
  const isPressed = keyIsActive && pressedKey === letter;
  const isSpacebarPressed = keyIsActive && isSpacebar && pressedKey === " ";

  return (
    <button
      type="button"
      className={`tm-key ${isPressed || isActive || isSpacebarPressed ? "tm-key-active" : ""} ${isFullWidth ? "w-full" : ""} ${letter.toUpperCase() === "ENTER" ? "px-2 text-sm sm:text-xs" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    >
      {letter !== "BACKSPACE" ? (
        letter
      ) : (
        <span aria-label="Backspace" className="text-base">
          ⌫
        </span>
      )}
    </button>
  );
}
