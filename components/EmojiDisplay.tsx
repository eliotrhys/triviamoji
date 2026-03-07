import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface EmojiDisplayProps {
  emoji: string,
  mediaType: string
}

const variants = {
  hidden: { opacity: 0 },
  showing: {
      opacity: 1,
      transition: {
          staggerChildren: 0.2
      }
  }
}

const animationItem = {
  hidden: {
      opacity: 0,
      scale: 0
  },
  showing: {
      opacity: 1,
      scale: 1,
      transition: {
          duration: 0.3,
          type: "spring", 
          bounce: 0.4
      }
  }
}

export default function EmojiDisplay(props: EmojiDisplayProps) {

  const [animateCategory, setAnimateCategory] = useState(false);
  const [categoryAnimationKey, setCategoryAnimationKey] = useState<number>(0);

  const [animateEmojis, setAnimateEmojis] = useState(false);
  const [emojiAnimationKey, setEmojiAnimationKey] = useState<number>(0);

  useEffect(() => {
    setAnimateCategory(true);
  }, []);

  useEffect(() => {
    // Define a function to toggle the grow-shrink animation class on and off
    const toggleAnimation = () => {
      setCategoryAnimationKey(Date.now());
      setAnimateCategory(true);
      // Remove the animation class after the animation is complete
      setTimeout(() => setAnimateCategory(false), 1000);
    };

    // Call the toggleAnimation function every 10 seconds
    const intervalId = setInterval(toggleAnimation, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Update the emojiAnimationKey every time the props.emoji value changes
    setEmojiAnimationKey((prevKey) => prevKey + 1);
    setAnimateEmojis(true);
    // Remove the animation class after the animation is complete
    setTimeout(() => setAnimateEmojis(false), 1000);
  }, [props.emoji]);
  
  function splitByForwardSlash(str: string): string[] {
    return str.split('/').filter((s) => s !== '');
  }

  const finalEmojis = splitByForwardSlash(props.emoji);

  return (
      <div className="mb-0 mx-auto text-center">
      <div
        key={categoryAnimationKey}
        className={`text-md lg:text-xl text-center border-4 border-purple-600 text-purple-600 bg-purple-100 px-6 inline-block rounded-md p-1 lg:p-2 text-center mb-10 menuMediaType ${
          animateCategory ? "grow-shrink" : ""
        }`}
      >
        {props.mediaType}
      </div>
        <div className="flex items-center justify-center flex-wrap">
          {finalEmojis.map((emoji: string, index: number) => (
            <div key={index}>
              <div
                key={emojiAnimationKey}
                className={`animate ${
                  animateEmojis ? "grow-shrink" : ""
                } ${ finalEmojis.length > 6 ? "text-5xl md:text-8xl" : "text-6xl md:text-8xl" }
                 mb-2 hover:scale-125 hover:rotate-[15deg] ease-in-out duration-100 mx-2 lg:mx-4 cursor-pointer`}
              >
                {emoji}
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}
