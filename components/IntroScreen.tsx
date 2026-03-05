import { motion } from "framer-motion";
import React, { useEffect } from "react";

interface IntroScreenProps {
  introTimeRemaining: number;
  onCountdownFinish: () => void;
  onIntroTimeTick: () => void;
  isSuddenDeath: boolean;
}

export default function IntroScreen(props: IntroScreenProps) {
  const { introTimeRemaining, onCountdownFinish, onIntroTimeTick, isSuddenDeath } = props;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
        onIntroTimeTick();
    }, 1000);

    return () => clearInterval(timer);
  }, [onIntroTimeTick]);

  useEffect(() => {
    if (introTimeRemaining === 0) {
      onCountdownFinish();
    }
  }, [introTimeRemaining, onCountdownFinish]);

  return (
    <div className={`min-h-screen min-w-screen text-center flex items-center justify-center ${ isSuddenDeath ? "bg-black" : "" }`}>
      <div className="container mx-auto px-4">
          <div className="flex flex-col justify-between">
            <div>
              <div className="w-full">
                <motion.div
                  animate={{ y: [-800, 0]} } 
                  transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                >
                  <div className="animate-bounce">
                    { isSuddenDeath ? 
                      <div>
                        <h1 className="huge-emoji">☠️</h1>
                        <h1 className="text-md lg:text-4xl -mt-10 mb-20 text-red-600">NO SECOND CHANCES</h1>
                      </div>
                      :
                      <div>
                        <h1 className="huge-emoji">⏰</h1>
                        <h1 className="text-md lg:text-4xl -mt-10 mb-20">Let the countdown begin!</h1>
                      </div>
                  }
                    
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [-800, 0]} } 
                  transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
                >
                  <h1 className={`text-5xl lg:text-9xl mb-10 ${ isSuddenDeath ? "text-red-600" : "text-black" } font-black`}>{ introTimeRemaining }</h1>
                </motion.div>
                <motion.div
                  animate={{ y: [800, 0]} } 
                  transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                >
                  <div>
                    { isSuddenDeath ? 
                      <div>
                        <div className="w-full sm:w-2/3 lg:1/2 mx-auto">
                          <div className="bg-white border-4 border-black p-4 text-md lg:text-2xl rounded-lg text-center">
                            <strong className="block mb-3"><span className="text-4xl">💡</span> Did you know?</strong> 
                            <div className="leading-loose">You can disable question categories you don&apos;t like in the <span className="bg-purple-500 text-white rounded-lg px-2 lg:px-4 border-4 border-black py-2 lg:py-4">OPTIONS</span> menu!</div>
                          </div>
                        </div>
                      </div>
                      :
                      <div>
                        <div className="w-full sm:w-2/3 lg:1/2 mx-auto">
                          <div className="bg-white border-4 border-black p-4 text-md lg:text-2xl rounded-lg text-center">
                            <strong className="block mb-3"><span className="text-4xl">💡</span> Did you know?</strong> 
                            <div className="leading-loose">You can disable question categories you don&apos;t like in the <span className="bg-purple-500 text-white rounded-lg px-2 lg:px-4 border-4 border-black py-2 lg:py-4">OPTIONS</span> menu!</div>
                          </div>
                        </div>
                      </div>
                  }
                    
                  </div>
                </motion.div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
