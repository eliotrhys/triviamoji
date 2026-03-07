import Question from "../app/types/Question";

import { MovieQuestions } from "./questions/movie";
import { TVShowQuestions } from "./questions/tv-show";
import { CartoonQuestions } from "./questions/cartoon";
import { VideoGameQuestions } from "./questions/video-game";
import { HistoricalEventQuestions } from "./questions/historical-event";
import { SongQuestions } from "./questions/song";
import { BookQuestions } from "./questions/book";
import { NationFlagQuestions } from "./questions/nation-flag";
import { MythsLegendsQuestions } from "./questions/myths-legends";
import { FamousPeopleQuestions } from "./questions/famous-people";
import { BrandsQuestions } from "./questions/brands";
import { LandmarksQuestions } from "./questions/landmarks";

export const questions: Question[] = [
  ...MovieQuestions,
  ...TVShowQuestions,
  ...CartoonQuestions,
  ...VideoGameQuestions,
  ...HistoricalEventQuestions,
  ...SongQuestions,
  ...BookQuestions,
  ...NationFlagQuestions,
  ...MythsLegendsQuestions,
  ...FamousPeopleQuestions,
  ...BrandsQuestions,
  ...LandmarksQuestions,
];
