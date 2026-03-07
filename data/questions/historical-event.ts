import Question from "../../app/types/Question";
import { MediaType } from "../../app/types/MediaType";

export const HistoricalEventQuestions: Question[] = [
  {
        title: "Moon Landing",
        acceptableAnswers: ["moon landing", "landing on the moon", "neil armstrong", "buzz aldrin", "moon landing 1969", "the moon landing", "apollo 11", "the apollo 11", "the apollo 11 moon landing", "apollo 11 moon landing"],
        emoji: "🌛/👨🏻‍🚀/🇺🇸",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "The Black Death",
        acceptableAnswers: ["the black death", "black death", "the black plague", "black plague", "the plague", "plague", "bubonic plague", "bubonic"],
        emoji: "🦠/⬛️/💀/🌍/🐀",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "Invention Of The Wheel",
        acceptableAnswers: ["invention of the wheel", "the invention of the wheel", "discovery of the wheel", "the discovery of the wheel", "the wheel", "wheel"],
        emoji: "🧔🏻/💡/🛠️/🛞",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "The Manhattan Project",
        acceptableAnswers: ["the manhattan project", "manhattan project", "the atomic bomb", "atomic bomb", "the nuclear bomb", "nuclear bomb", "nuclear warhead", "the invention of the atomic bomb", "the invention of the nuclear bomb"],
        emoji: "👨🏻‍🔬/🍄/☁️/💣",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "The Cold War",
        acceptableAnswers: ["the cold war", "cold war"],
        emoji: "🥶/☢️/🚀",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "The American Civil War",
        acceptableAnswers: ["american civil war", "civil war", "the civil war", "us civil war", "north vs south", "the american civil war"],
        emoji: "🇺🇸/👨🏻/🗡️/🔥/👨🏻/🇺🇸",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "The French Revolution",
        acceptableAnswers: ["french revolution", "the french revolution"],
        emoji: "🇫🇷/👑/🚫",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "The Industrial Revolution",
        acceptableAnswers: ["the industrial revolution", "industrial revolution"],
        emoji: "💡/🏭/🚂/💰/🌍",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "Fall Of The Berlin Wall",
        acceptableAnswers: ["berlin wall", "the berlin wall", "fall of the berlin wall", "berlin wall falls", "the fall of the berlin wall", "berlin", "wall", "knocking down the berlin wall", "berlin wall knocked down", "fall of berlin wall", "1989"],
        emoji: "🇩🇪/🧱/💥/🕊️",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "The Cuban Missile Crisis",
        acceptableAnswers: ["missile crisis", "cuban missile crisis", "cuban missiles", "cuban missiles crisis", "the cuban missile crisis", "the cuban missiles crisis"],
        emoji: "🇨🇺/🚀/🚀/🇺🇸/😱",
        mediaType: MediaType.HistoricalEvent
    },

  {
        title: "Boston Tea Party",
        acceptableAnswers: ["tea party", "boston tea party"],
        emoji: "🚢/😡/🚫/🫖/↘️/🌊/🇺🇸",
        mediaType: MediaType.HistoricalEvent
    }
];
