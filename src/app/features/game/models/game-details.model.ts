import { ColorEnum } from "../enums/color.enum";
import { GameStatusEnum } from "../enums/game-status.enum";

export interface GameDetailsModel {
    id: string;
    status: GameStatusEnum;
    redUserId: number|null
    redUsername: string|null;
    redIsConnected: boolean;
    yellowUserId: number|null
    yellowUsername: string|null;
    yellowIsConnected: boolean;
    grid: (ColorEnum|null)[][];
    winnerUsername: string|null;
    winnerId: number|null;
}