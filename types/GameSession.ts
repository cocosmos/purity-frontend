import {Question} from "@/types/Question";
import {Game} from "@/types/Game";

export enum GameSessionStatus {
    STARTED = 'started',
    IN_PROGRESS = 'in_progress',
    FINISHED = 'finished',
}

export interface GameSession {
    id: number;
    status: GameSessionStatus;
    game: Game;
    first_question: Question;
}