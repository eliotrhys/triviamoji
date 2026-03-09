import { motion } from "framer-motion";
import { useEffect } from "react";

interface IntroScreenProps {
  introTimeRemaining: number;
  onCountdownFinish: () => void;
  onIntroTimeTick: () => void;
  isSuddenDeath: boolean;
}

export default function IntroScreen({ introTimeRemaining, onCountdownFinish, onIntroTimeTick, isSuddenDeath }: IntroScreenProps) {
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
    <div className="tm-card mx-auto mt-8 max-w-3xl p-8 text-center sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{isSuddenDeath ? "Sudden Death" : "Timed Challenge"}</p>
      <h2 className="tm-title mt-3 text-3xl sm:text-5xl">{isSuddenDeath ? "One mistake ends your run" : "Race the clock"}</h2>
      <motion.div
        key={introTimeRemaining}
        initial={{ opacity: 0.4, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="mt-5 text-6xl font-black text-sky-600 sm:text-8xl"
      >
        {introTimeRemaining}
      </motion.div>
      <p className="mt-4 text-sm text-slate-600">You can customize categories in Options.</p>
    </div>
  );
}
