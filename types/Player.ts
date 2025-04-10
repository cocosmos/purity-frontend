import { GameSession } from "./GameSession";

export interface Player {
  id: string;
  avatar: string;
  username: string;
  game_sessions: GameSession[];
}
