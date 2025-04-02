import axiosInstance from "@/api/index";
import {Player} from "@/types/Player";

export const startGameSession = async (game_id:number, player_id:number)=> {
    return await axiosInstance.post("/game-sessions/start", {
        game_id,
        player_id
    });
}

export const answerQuestion = async (game_session_id:number, question_id:number, value:number)=> {
    return await axiosInstance.post(`/game-sessions/${game_session_id}/answer`, {
        question_id,
        value
    });
}

export const getGameSession = async (game_session_id:number)=> {
    return await axiosInstance.get(`/game-sessions/${game_session_id}`);
}