import { Question } from "./Question";
import { Game } from "./Game";

export enum GameSessionStatus {
  STARTED = "started",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
}

export interface GameSession {
  id: number;
  status: GameSessionStatus;
  game: Game;
  current_question: Question | null;
  total_questions: number;
  answered_questions: number;
}
