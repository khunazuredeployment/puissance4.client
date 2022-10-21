import { ColorEnum } from "../enums/color.enum";

export interface CoinModel {
    gameId: string; 
    column: number; 
    height: number; 
    color: ColorEnum;
}