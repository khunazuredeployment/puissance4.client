import { createAction, createReducer, on, props } from "@ngrx/store"
import { ColumnFilter } from "primeng/table";
import { ColorEnum } from "../enums/color.enum";
import { CoinModel } from "../models/coin.model";
import { GameDetailsModel } from "../models/game-details.model"
import { GameModel } from "../models/game.model"

export interface GamesState {
    allGames: GameModel[],
    currentGame: GameDetailsModel|null
}

export const loadGames = createAction('games/load', props<{games: GameModel[]}>() );
export const loadCurrentGame = createAction('games/loadCurrentGame', props<{game: GameDetailsModel|null}>() );
export const newCoin = createAction('games/newCoin', props<{coin: CoinModel}>());

const initialState: GamesState = {
    allGames: [],
    currentGame: null,
}

export const GamesReducer = createReducer(
    initialState,
    on(loadGames, (state, payload) => {
        return { ...state, allGames: payload.games };
    }),
    on(loadCurrentGame, (state, payload) => {
        return { ...state, currentGame: payload.game };
    }),
    on(newCoin, (state, payload) => {
        if(state.currentGame && state.currentGame.id === payload.coin.gameId) {
            state.currentGame.grid[payload.coin.column][payload.coin.height] = payload.coin.color;            
            return { ...state };
        }
        return { ...state }
    }),
); 