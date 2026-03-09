interface PopoverProps {
  correctAnswer?: string;
  correctAnswerEmoji?: string;
}

export default function Popover({ correctAnswer, correctAnswerEmoji }: PopoverProps) {
  return (
    <div className="tm-popover z-20 rounded-2xl">
      <div className="min-w-[110px] text-center">
        <div className="text-4xl">{correctAnswerEmoji !== undefined ? correctAnswerEmoji.replaceAll("/", "") : ""}</div>
        <div className="text-xs font-semibold text-slate-700">{correctAnswer}</div>
      </div>
    </div>
  );
}
