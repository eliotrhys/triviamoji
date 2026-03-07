import { motion } from "framer-motion";
import React, { useEffect } from "react";
import Guess from "../app/types/Guess";
import Points from "./Points";

interface CongratulationsScreenProps {
  onRestart: () => void;
  finalScore: number;
  guesses: Guess[];
  count: number;
  isSuddenDeath: boolean;
  lastIncorrectAnswer: string;
  lastIncorrectEmoji: string;
  showFailureAd: boolean;
}

export default function CongratulationsScreen(props: CongratulationsScreenProps) {
  const failureAdSlotId = process.env.NEXT_PUBLIC_ADSENSE_FAILURE_SLOT;
  const shouldRenderFailureAd = props.showFailureAd && Boolean(failureAdSlotId);

  useEffect(() => {
    if (!shouldRenderFailureAd || typeof window === "undefined") {
      return;
    }

    try {
      const adSlot = document.querySelector("ins.adsbygoogle:not([data-adsbygoogle-status])");

      if (!adSlot) {
        return;
      }

      ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense failed to render", error);
    }
  }, [shouldRenderFailureAd]);

  const renderHighestScoreBlock = () => {
    if (typeof window !== "undefined") 
    {
      let highestScoreForGameMode = 0;

      if (props.isSuddenDeath)
      {
        const highestScoreSuddenDeath = parseInt(localStorage.getItem("highestScoreSuddenDeath") ?? "0");
        highestScoreForGameMode = highestScoreSuddenDeath;
      }
      else 
      {
        const highestScore = parseInt(localStorage.getItem("highestScore") ?? "0");
        highestScoreForGameMode = highestScore;
      }

      return (
        <div className="py-1 px-1 text-black text-sm lg:text-base">
          High score{" "}
          <span className="text-blue-500">
            {highestScoreForGameMode} {highestScoreForGameMode > 1 || highestScoreForGameMode === 0 ? "points" : "point"}
          </span>
        </div>
      )
    } 
    else 
    {
      return null;
    }
  }

  return (
    <div className="min-h-[calc(100vh-40px)] lg:min-h-[calc(100vh-56px)] min-w-screen text-center relative">
      <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-20">
        <div className="w-36 h-72 bg-white border-4 border-black rounded-lg flex items-center justify-center text-xs text-slate-500 text-center p-2">
          {shouldRenderFailureAd ? (
            <ins
              className="adsbygoogle block w-full h-full"
              style={{ display: "block" }}
              data-ad-client="ca-pub-8259590562391591"
              data-ad-slot={failureAdSlotId}
              data-ad-format="vertical"
              data-full-width-responsive="true"
            />
          ) : (
            "Advertisement"
          )}
        </div>
      </div>
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-20">
        <div className="w-36 h-72 bg-white border-4 border-black rounded-lg flex items-center justify-center text-xs text-slate-500 text-center p-2">
          {shouldRenderFailureAd ? (
            <ins
              className="adsbygoogle block w-full h-full"
              style={{ display: "block" }}
              data-ad-client="ca-pub-8259590562391591"
              data-ad-slot={failureAdSlotId}
              data-ad-format="vertical"
              data-full-width-responsive="true"
            />
          ) : (
            "Advertisement"
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 h-full">
        <div className="grid h-full">

          <div className="flex flex-col justify-between">

            <div>
              <div className="w-full">
                <motion.div 
                  animate={{ x: [-800, 0]} } 
                  transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
                >
                  { props.isSuddenDeath ? 
                    <div>
                      <h1 className="huge-emoji -mb-10">☠️</h1>
                      <h1 className="text-2xl lg:text-5xl mb-2 lg:mb-4 font-black">Oof.</h1>
                      <div className="mb-4 lg:mb-6">
                        <span className="bg-black text-white border-4 border-white rounded-md px-3 py-1 inline-block">
                          ☠️ Sudden Death ☠️
                        </span>
                      </div>
                    </div>
                    :
                    <div>
                      <h1 className="huge-emoji -mb-10">💩</h1>
                      <h1 className="text-2xl lg:text-5xl mb-2 lg:mb-4 font-black">Time&apos;s up!</h1>
                      <div className="mb-4 lg:mb-6">
                        <span className="bg-white text-black border-4 border-black rounded-md px-3 py-1 inline-block">
                          ⏰ Timed
                        </span>
                      </div>
                    </div>
                  }
                </motion.div>
              </div>

              <div className="w-full lg:w-1/3 mx-auto mb-8">
                <motion.div
                  animate={{ x: [-800, 0]} } 
                  transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
                >
                  <button className="px-10 py-4 w-full text-center hover:scale-110 ease-in-out duration-100 border-4 border-black bg-blue-500 hover:bg-blue-700 text-white rounded-full inline-block cursor-pointer shadow-lift" onClick={props.onRestart}>Restart Game</button>
                </motion.div>
              </div>

              <div className="w-full lg:w-1/3 mx-auto">
                <div className="mt-10">
                  { props.lastIncorrectAnswer && (
                    <motion.div
                      animate={{ x: [-800, 0]} }
                      transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
                      className="mb-4 bg-white text-black border-4 border-black rounded-lg py-3 px-4"
                    >
                      {props.lastIncorrectEmoji && (
                        <div className="text-4xl lg:text-6xl mb-2">{props.lastIncorrectEmoji.replaceAll("/", "")}</div>
                      )}
                      <div className="text-base lg:text-lg text-black">
                        The answer was
                        <div className="text-red-500 text-base lg:text-lg">{props.lastIncorrectAnswer}</div>
                      </div>
                    </motion.div>
                  )}
                    
                  <motion.div className="mb-4 lg:mb-10 bg-white border-black border-4 rounded-lg text-center" 
                    animate={{ x: [-800, 0]} } 
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                  >
                    <div className="flex items-center justify-center border-b-4 pt-4 pb-4 border-black">
                      <div className="text-4xl">🏅</div>
                      <h2 className="text-xl lg:text-2xl ml-2">
                        You scored{" "}
                        <span className="text-blue-500 underline decoration-4 decoration-blue-500 underline-offset-4">
                          {props.finalScore} {props.finalScore > 1 || props.finalScore === 0 ? "points" : "point"}
                        </span>
                      </h2>
                    </div>
                    
                    { props.count > 0 && 
                      <div className="py-2 lg:py-3">
                        <Points count={props.count} guesses={props.guesses} />
                      </div>
                    }
                    <div className="pt-0 pb-2 px-4">
                      { renderHighestScoreBlock() }
                    </div>
                  </motion.div>

                  {shouldRenderFailureAd && (
                    <motion.div
                      animate={{ x: [-800, 0] }}
                      transition={{ type: "spring", bounce: 0.2, duration: 1.0 }}
                      className="mb-6 bg-white border-4 border-black rounded-lg p-4"
                    >
                      <div className="text-xs mb-2 text-slate-500">Advertisement</div>
                      <ins
                        className="adsbygoogle block"
                        style={{ display: "block", minHeight: "120px" }}
                        data-ad-client="ca-pub-8259590562391591"
                        data-ad-slot={failureAdSlotId}
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                      />
                    </motion.div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        animate={{ y: [800, 0]} } 
        transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
      >
        <img className="absolute bottom-0 right-0 corner-smiley hover:scale-125 ease-in-out duration-100" src="/images/smileys/smiley_happy.png" alt={"Happy smiley face"} />
      </motion.div>
      <motion.div
        animate={{ y: [800, 0]} } 
        transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
      >
        <img className="absolute bottom-0 left-0 corner-smiley hover:scale-125 ease-in-out duration-100" src="/images/smileys/smiley_love.png" alt={"Happy smiley face"} />
      </motion.div>
    </div>
  );
}
