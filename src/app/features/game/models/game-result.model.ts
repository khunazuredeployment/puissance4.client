import { GameResultEnum } from "../enums/game-result.enum";

export interface GameResultModel {
    id: string;
    winnerUsername: string|null;
    winnerId: number|null;
    result: GameResultEnum|null;
}