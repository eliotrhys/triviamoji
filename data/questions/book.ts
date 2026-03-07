import Question from "../../app/types/Question";
import { MediaType } from "../../app/types/MediaType";

export const BookQuestions: Question[] = [
  {
        title: "The Lord Of The Rings",
        acceptableAnswers: ["the lord of the rings", "lord of the rings", "lotr", "thefellowship of the ring", "the two towers", "the 2 towers", "2 towers", "the return of the king", "fellowship of the ring", "two towers", "return of the king"],
        emoji: "🧙‍♂️/🧌/🧝‍♀️/💍",
        mediaType: MediaType.Book
    },

  {
        title: "Animal Farm",
        acceptableAnswers: ["animal farm", "the animal farm", "george orwell animal farm"],
        emoji: "🐷/🐴/🐕/☭",
        mediaType: MediaType.Book
    },

  {
        title: "The Hitchhiker's Guide To The Galaxy",
        acceptableAnswers: ["the hitchhiker's guide to the galaxy", "the hitchhikers guide to the galaxy", "hitchhiker's guide to the galaxy", "hitchhikers guide to the galaxy", "hitchhiker's guide", "hitchhikers guide", "hitchhiker's", "hitchhikers"],
        emoji: "👍/🗺️/🌌",
        mediaType: MediaType.Book
    },

  {
        title: "The Grapes Of Wrath",
        acceptableAnswers: ["the grapes of wrath", "grapes of wrath", "grapes wrath", "grapes wroth", "the grapes of wroth"],
        emoji: "🍇/😡",
        mediaType: MediaType.Book
    },

  {
        title: "The Old Man And The Sea",
        acceptableAnswers: ["the old man and the sea", "old man and the sea", "old man and sea"],
        emoji: "👴🏻/🌊/🎣",
        mediaType: MediaType.Book
    },

  {
        title: "War And Peace",
        acceptableAnswers: ["war and peace", "war & peace", "peace and war", "peace & war"],
        emoji: "😡/💣/🔥/🔫/🪦/&/🕊️",
        mediaType: MediaType.Book
    },

  {
        title: "Moby Dick",
        acceptableAnswers: ["moby dick", "the whale", "moaby dick", "whale"],
        emoji: "🐋/🔫/⛴️/👴🏻",
        mediaType: MediaType.Book
    },

  {
        title: "Harry Potter",
        acceptableAnswers: ["harry potter", "hogwarts", "harry potter and the philosopher's stone", "harry potter and the philosophers stone", "harry potter and the sorcerer's stone", "harry potter and the sorcerers stone"],
        emoji: "👦🏻/⚡️/🪄",
        mediaType: MediaType.Book
    },

  {
        title: "Dracula",
        acceptableAnswers: ["dracula", "bram stokers dracula", "bram stoker's dracula"],
        emoji: "🧛🏻",
        mediaType: MediaType.Book
    },

  {
        title: "Frankenstein",
        acceptableAnswers: ["frankenstein", "mary shelleys frankenstein", "mary shelley's frankenstein", "frankenstien"],
        emoji: "😵/👨🏻‍🔬/🧪/🧟‍♂️/🏘️/🔥",
        mediaType: MediaType.Book
    }
];
