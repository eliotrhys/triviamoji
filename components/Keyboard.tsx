import React, { useCallback, useEffect, useState } from "react";
import Key from "./Key";

type KeyboardLayout = string[][];
type KeyboardControls = string[];

interface KeyboardProps {
  handleCurrentWordChange: (currentWord: string) => void;
  onEnter: () => void;
  showPreview?: boolean;
  plainPreview?: boolean;
}

export default function Keyboard({ handleCurrentWordChange, onEnter, showPreview = true, plainPreview = false }: KeyboardProps) {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [keyIsActive, setKeyIsActive] = useState(false);
  const [pressedKey, setPressedKey] = useState("");

  const handleKeyPress = useCallback(
    (letter: string) => {
      switch (letter) {
        case "BACKSPACE":
          if (currentWord.length > 0) {
            setCurrentWord(currentWord.slice(0, -1));
          }
          break;
        case "SPACE":
          if (currentWord.length > 0) {
            setCurrentWord((word) => `${word} `);
          }
          break;
        case "ENTER":
          handleCurrentWordChange(currentWord);
          onEnter();
          setCurrentWord("");
          break;
        default:
          if (currentWord.length < 75) {
            setCurrentWord((word) => `${word}${letter}`);
          }
          break;
      }
    },
    [currentWord, handleCurrentWordChange, onEnter],
  );

  useEffect(() => {
    handleCurrentWordChange(currentWord);
  }, [currentWord, handleCurrentWordChange]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      setKeyIsActive(true);

      const allowedKeys = [
        "BACKSPACE",
        "ENTER",
        " ",
        "'",
        "-",
        ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
        ...Array.from({ length: 10 }, (_, i) => String.fromCharCode(48 + i)),
      ];

      if (!allowedKeys.includes(key)) {
        return;
      }

      setPressedKey(key);

      if (key === "BACKSPACE") {
        handleKeyPress("BACKSPACE");
      } else if (key === "ENTER") {
        event.preventDefault();
        handleKeyPress("ENTER");
      } else if (key === " " || key === "SPACE") {
        if (event.target === document.body) {
          event.preventDefault();
        }
        handleKeyPress(" ");
      } else {
        handleKeyPress(key);
      }
    },
    [handleKeyPress],
  );

  const handleKeyUp = useCallback(() => {
    setKeyIsActive(false);
    setPressedKey("");
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const keyboardLayout: KeyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const keyboardControls: KeyboardControls = ["SPACE"];

  return (
    <>
      {showPreview && (
        <div className={`tm-input-preview mb-3 text-center ${plainPreview ? "tm-input-preview-plain" : ""}`}>
          {currentWord === "" ? <span className="tm-keyboard-placeholder">Start typing your guess...</span> : currentWord}
        </div>
      )}
      <div className="space-y-1">
        {keyboardLayout.map((row, rowIndex) => (
          <div className="flex items-center justify-center gap-1" key={rowIndex}>
            {row.map((letter) => (
              <Key key={letter} letter={letter} onClick={handleKeyPress} keyIsActive={keyIsActive} pressedKey={pressedKey} isFullWidth={false} />
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-1 grid max-w-[340px] grid-cols-3 gap-1">
        {keyboardControls.map((letter) => (
          <div key={letter} className="col-span-1 col-start-2 w-full">
            <Key key={letter} letter={letter} onClick={handleKeyPress} keyIsActive={keyIsActive} pressedKey={pressedKey} isFullWidth={true} />
          </div>
        ))}
      </div>
    </>
  );
}
