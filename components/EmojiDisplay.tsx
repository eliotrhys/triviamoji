import { motion } from "framer-motion";

interface EmojiDisplayProps {
  emoji: string;
  mediaType: string;
  framed?: boolean;
}

export default function EmojiDisplay({ emoji, mediaType, framed = true }: EmojiDisplayProps) {
  const emojiTokens = emoji.split("/").filter((entry) => entry !== "");

  return (
    <section className={`${framed ? "tm-card p-5 sm:p-6" : "p-3 sm:p-4"} text-center`}>
      <span className="tm-badge">{mediaType}</span>
      <motion.div
        key={emoji}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
        className="tm-emoji-row mt-4"
      >
        {emojiTokens.map((token, index) => (
          <span key={`${token}-${index}`} className="tm-emoji-char">
            {token}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
