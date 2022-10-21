import { GameStatusEnum } from "../enums/game-status.enum";

export interface GameModel {
    id: string;
    status: GameStatusEnum;
    redUserId: number|null
    redUsername: string|null;
    redIsConnected: boolean;
    yellowUserId: number|null
    yellowUsername: string|null;
    yellowIsConnected: boolean;
}