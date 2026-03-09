import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
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

export default function CongratulationsScreen({
  onRestart,
  finalScore,
  guesses,
  count,
  isSuddenDeath,
  lastIncorrectAnswer,
  lastIncorrectEmoji,
  showFailureAd,
}: CongratulationsScreenProps) {
  const failureAdSlotId = process.env.NEXT_PUBLIC_ADSENSE_FAILURE_SLOT;
  const shouldRenderFailureAd = showFailureAd && Boolean(failureAdSlotId);
  const [copiedMessage, setCopiedMessage] = useState("");

  useEffect(() => {
    if (!shouldRenderFailureAd || typeof window === "undefined") {
      return;
    }

    try {
      ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // Ignore ad render issues.
    }
  }, [shouldRenderFailureAd]);

  const highestScore = (() => {
    if (typeof window === "undefined") {
      return 0;
    }

    return isSuddenDeath
      ? parseInt(localStorage.getItem("highestScoreSuddenDeath") ?? "0", 10)
      : parseInt(localStorage.getItem("highestScore") ?? "0", 10);
  })();

  const dateKey = useMemo(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const resultSquares = useMemo(() => guesses.map((guess) => (guess.isCorrect ? "🟩" : "🟥")).join(""), [guesses]);
  const runEmoji = useMemo(() => (lastIncorrectEmoji ? lastIncorrectEmoji.replaceAll("/", "") : ""), [lastIncorrectEmoji]);
  const copyableResult = useMemo(() => {
    return `TriviaMoji Sudden Death ${dateKey}\n${finalScore}\n${resultSquares}${runEmoji ? `\n${runEmoji}` : ""}`;
  }, [dateKey, finalScore, resultSquares, runEmoji]);

  const copyText = async (content: string, message: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(content);
    setCopiedMessage(message);
    window.setTimeout(() => setCopiedMessage(""), 1400);
  };

  const shareResult = async () => {
    const text = `TriviaMoji Sudden Death ${dateKey}\nFinal Score ${finalScore}\n${resultSquares}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text, title: "TriviaMoji Sudden Death" });
        return;
      } catch {
        // Fall back to clipboard.
      }
    }

    await copyText(text, "Score copied");
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`tm-card p-6 text-center sm:p-7 ${isSuddenDeath ? "tm-sd-surface" : ""}`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Game Over</p>
        <h1 className="tm-title mt-2 text-3xl sm:text-4xl">{isSuddenDeath ? "GAME OVER" : "Time Up"}</h1>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="tm-pill tm-pill-primary">Final Score {finalScore}</span>
          <span className="tm-pill">Best Score {highestScore}</span>
        </div>

        {lastIncorrectAnswer && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-rose-700">
            <div className="text-3xl">{lastIncorrectEmoji ? lastIncorrectEmoji.replaceAll("/", "") : ""}</div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Last answer was</div>
            <div className="mt-1 text-3xl font-extrabold text-rose-700 sm:text-4xl">{lastIncorrectAnswer.toUpperCase()}</div>
          </div>
        )}

        {count > 0 && (
          <div className="mt-4">
            <Points count={count} guesses={guesses} />
          </div>
        )}

        <div className="tm-copy-block mx-auto mt-4 w-full max-w-md rounded-xl border border-[#d9e2ef] bg-[#f8fbff] px-3 py-2 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Copy Result</span>
            <button type="button" className="tm-btn-copy-icon" onClick={() => copyText(copyableResult, "Result copied")} aria-label="Copy sudden death result">
              📋
            </button>
          </div>
          <pre className="mt-1 whitespace-pre-wrap text-left text-base font-medium leading-6">{copyableResult}</pre>
          {copiedMessage && <div className="tm-copy-popover tm-feedback-correct">{copiedMessage}</div>}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button type="button" className="tm-btn-share" onClick={shareResult}>
            Share Score
          </button>
          <button type="button" className="tm-btn-copy" onClick={() => copyText(`Final Score ${finalScore}`, "Score copied")}>
            Copy Score
          </button>
          <button className="tm-btn-primary" onClick={onRestart}>
            Play Again
          </button>
        </div>
      </motion.section>

      {shouldRenderFailureAd && (
        <section className="tm-card mt-4 p-4">
          <div className="tm-ad-label mb-2">Advertisement</div>
          <ins
            className="adsbygoogle block"
            style={{ display: "block", minHeight: "120px" }}
            data-ad-client="ca-pub-8259590562391591"
            data-ad-slot={failureAdSlotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </section>
      )}
    </div>
  );
}
