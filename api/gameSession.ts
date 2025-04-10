import axiosInstance from "@/api/index";
import { Category } from "@/types/Category";
import { GameSession } from "@/types/GameSession";

export const startGameSession = async (
  game_id: number,
  player_id: number
): Promise<{ data: { game_session_id: number } }> => {
  return await axiosInstance.post("/game-sessions/start", {
    game_id,
    player_id,
  });
};

export const answerQuestion = async (
  game_session_id: number,
  question_id: number,
  question_answer_id: number | null = null,
  value: number | boolean | null = null
) => {
  return await axiosInstance.post(`/game-sessions/${game_session_id}/answer`, {
    question_id,
    question_answer_id,
    value,
  });
};

export const getGameSession = async (game_session_id: number) => {
  return await axiosInstance.get(`/game-sessions/${game_session_id}`);
};

export const getGameSessionScores = async (
  game_session_id: number
): Promise<{
  data: { game_session: GameSession; categories: Category[] }[];
}> => {
  return await axiosInstance.get(`/game-sessions/${game_session_id}/scores`);
};
