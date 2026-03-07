"use client"

import { useCallback, useEffect, useState } from "react";

// Components
import Counter from "./Counter";
import EmojiDisplay from "./EmojiDisplay";
import GuessInput from "./GuessInput";
import Countdown from "./Countdown";
import Points from "./Points";
import CongratulationsScreen from "./CongratulationsScreen";
import SideMenu from "./SideMenu";
import IntroScreen from "./IntroScreen";
import Navbar from "./Navbar";

// Utils & Data
import { questions } from "../data/questions";
import shuffle from "../app/utils/shuffle";

// Types
import Question from "../app/types/Question";
import Guess from "../app/types/Guess";
import { MediaType } from "../app/types/MediaType";


interface GameFormProps {
  isSuddenDeath: boolean;
}

export default function GameForm(props: GameFormProps) {
  const { isSuddenDeath } = props;
  // Initialisation
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  // Question details
  const [count, setCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [acceptableAnswers, setAcceptableAnswers] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [lastIncorrectAnswer, setLastIncorrectAnswer] = useState("");
  const [lastIncorrectEmoji, setLastIncorrectEmoji] = useState("");

  // Game states
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [introTimeRemaining, setIntroTimeRemaining] = useState(3);
  const [showIntroScreen, setShowIntroScreen] = useState(true);
  const [showFailureAd, setShowFailureAd] = useState(false);

  const [highestScore, setHighestScore] = useState<number>(
    typeof window !== "undefined" ? parseInt(localStorage.getItem("highestScore") ?? "0") : 0
  );

  const [highestScoreSuddenDeath, setHighestScoreSuddenDeath] = useState<number>(
    typeof window !== "undefined" ? parseInt(localStorage.getItem("highestScoreSuddenDeath") ?? "0") : 0
  );

  const [showCongratulationsScreen, setShowCongratulationsScreen] = useState(false);

  // Shuffle the questions array and store the shuffled array in state
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const finalizeGame = useCallback(() => {
    if (typeof window !== "undefined") {
      const completedGames = parseInt(localStorage.getItem("completedGamesCount") ?? "0");
      setShowFailureAd(completedGames >= 1);
      localStorage.setItem("completedGamesCount", (completedGames + 1).toString());
    }

    setShowCongratulationsScreen(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowHeight(window.innerHeight);
      };

      handleResize();

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const divMinHeight = {
    minHeight: windowHeight,
  };

  // This function shuffles the questions array and starts Intro Countdown
  useEffect(() => {
    if (typeof window !== "undefined") {
      let savedCheckedItems = JSON.parse(localStorage.getItem('checkedItems') || '[]');
      
      // Initialize with Nation Flags excluded by default for new users only
      if (savedCheckedItems.length === 0) {
        savedCheckedItems = [MediaType.NationFlag];
        localStorage.setItem('checkedItems', JSON.stringify(savedCheckedItems));
      }

      const filteredQuestions = questions.filter((question) => {
        return !savedCheckedItems.includes(question.mediaType);
      });

      const shuffledQuestions = shuffle(filteredQuestions);
      setShuffledQuestions(shuffledQuestions);
    }
  }, []);

  // This functions sets the title, emoji and mediaType when the questionIndex changes
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      setTitle(shuffledQuestions[questionIndex].title);
      setEmoji(shuffledQuestions[questionIndex].emoji);
      setMediaType(shuffledQuestions[questionIndex].mediaType);
      setAcceptableAnswers(shuffledQuestions[questionIndex].acceptableAnswers);
    }
  }, [questionIndex, shuffledQuestions]);

  // This function gets the Local Storage high score
  useEffect(() => {
    if (typeof window !== "undefined") {

      if (isSuddenDeath) 
      {
        if (correctCount > highestScoreSuddenDeath) {
          setHighestScoreSuddenDeath(correctCount);
          localStorage.setItem("highestScoreSuddenDeath", correctCount.toString());
        }
      }
      else 
      {
        if (correctCount > highestScore) {
          setHighestScore(correctCount);
          localStorage.setItem("highestScore", correctCount.toString());
        }
      }
    }
  }, [correctCount, highestScore, highestScoreSuddenDeath, isSuddenDeath]);
  
  // Handle Guess
  const handleGuess = (isCorrect: boolean) => {
    setCount((prevCount) => prevCount + 1);

    const newGuess: Guess = { guess: title, isCorrect };

    if (newGuess.isCorrect) {
      setCorrectCount((prevIndex) => prevIndex + 1)
    }

    if (questionIndex === shuffledQuestions.length - 1) {
      // Should never be hit but keep in case
      finalizeGame();
    } 
    else if (isSuddenDeath && !newGuess.isCorrect)
    {
      setLastIncorrectAnswer(title);
      setLastIncorrectEmoji(emoji);
      finalizeGame();
    }
    else
    {
      setQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleGuessUpdate = useCallback((updatedGuesses: Guess[]) => {
    setGuesses(updatedGuesses);
 }, []);

  const handleRestart = () => {
    setCount(0);
    setCorrectCount(0);
    setQuestionIndex(0);
    setGuesses([]);
    setShowFailureAd(false);
    setLastIncorrectAnswer("");
    setLastIncorrectEmoji("");
    setShowCongratulationsScreen(false);

    if (typeof window !== "undefined") 
    {
      let savedCheckedItems = JSON.parse(localStorage.getItem('checkedItems') || '[]');
      
      // Ensure Nation Flags is excluded by default for new users only
      if (savedCheckedItems.length === 0) {
        savedCheckedItems = [MediaType.NationFlag];
        localStorage.setItem('checkedItems', JSON.stringify(savedCheckedItems));
      }

      const filteredQuestions = questions.filter((question) => {
        return !savedCheckedItems.includes(question.mediaType);
      });

      const shuffledQuestions = shuffle(filteredQuestions);
      setShuffledQuestions(shuffledQuestions);
    }

    setIsMenuOpen(false);
    handleIntroCountdownStart();
  };

  // COUNTDOWN
  const handleCountdownFinish = () => {
    finalizeGame();
  }

  const handleIntroCountdownStart = () => {
    setShowIntroScreen(true);
  }

  const handleIntroCountdownFinish = () => {
    setShowIntroScreen(false);
    setIntroTimeRemaining(3);
    setTimeRemaining(60);
  }

  const handleTimeTick = () => {
    if (!isSuddenDeath) 
    {
      setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
    }
  }

  const handleIntroTimeTick = () => {
    setIntroTimeRemaining((prevIntroTimeRemaining) => prevIntroTimeRemaining - 1);
  }

  const handleMenuToggle = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const handleCheckboxChange = (checkedItems: string[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
    }
  };

  return (
    <div className="bg-smiles overflow-x-hidden">
      <SideMenu isOpen={isMenuOpen} onMenuToggle={handleMenuToggle} onCheckboxChange={handleCheckboxChange} />

      <div className="flex flex-col justify-between" style={divMinHeight}>
        {showCongratulationsScreen ? (
          <>
            <div className="min-h-screen min-w-screen flex flex-col justify-between">
              <Navbar onMenuToggle={handleMenuToggle} />
              <CongratulationsScreen onRestart={handleRestart} count={count} guesses={guesses} finalScore={guesses.filter((guess) => guess.isCorrect === true).length} isSuddenDeath={isSuddenDeath} lastIncorrectAnswer={lastIncorrectAnswer} lastIncorrectEmoji={lastIncorrectEmoji} showFailureAd={showFailureAd} />
            </div>
          </>
        ) : showIntroScreen ? (
          <>
            <div className="min-h-screen min-w-screen flex flex-col justify-between">
              <Navbar onMenuToggle={handleMenuToggle} isDark={isSuddenDeath} />
              <IntroScreen introTimeRemaining={introTimeRemaining} onIntroTimeTick={handleIntroTimeTick} onCountdownFinish={handleIntroCountdownFinish} isSuddenDeath={isSuddenDeath} />
            </div>
          </>
        ) : (
          <>
          <div>
            <Navbar onMenuToggle={handleMenuToggle} />

            <div className="container mx-auto px-4">
              <div className="grid">
                  <div className="w-full lg:w-2/3 xl:w-1/3 mx-auto flex flex-col justify-between">
                    <div className="">
                      <div className="rounded-full text-black mt-4">
                        <div className={`grid ${ isSuddenDeath ? "grid-cols-1" : "grid-cols-2"} mb-2`}>
                          <Counter count={count} isSuddenDeath={isSuddenDeath} />
                          { isSuddenDeath ? 
                            null 
                            :
                            <div className="px-2">
                              <Countdown timeRemaining={timeRemaining} onTimeTick={handleTimeTick} onCountdownFinish={handleCountdownFinish} />
                            </div>
                          }
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="mb-1 lg:mb-2 min-h-12">
                      <Points count={count} guesses={guesses} />
                    </div>
                  </div>
                </div>
                
            </div>
          </div>
          <div className="w-full">
            <EmojiDisplay emoji={emoji} mediaType={mediaType} />
          </div>
          <div className="keyboard-container">
            <div className="container mx-auto">
              <div className="w-full lg:w-2/3 xl:w-3/6 mx-auto flex flex-col justify-between">
                <div className="mt-4 lg:mt-4">
                  <GuessInput
                    answer={title}
                    answerEmoji={emoji}
                    potentialAnswers={acceptableAnswers}
                    onGuess={handleGuess}
                    onGuessesUpdate={handleGuessUpdate}
                    guesses={guesses}
                  />
                </div>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
