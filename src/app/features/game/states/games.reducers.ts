import { createAction, createReducer, on, props } from "@ngrx/store"
import { GameHubStatusEnum } from "../enums/game-hub-status.enum";
import { CoinModel } from "../models/coin.model";
import { GameDetailsModel } from "../models/game-details.model"
import { GamePlayersConnectionModel } from "../models/game-players-connection.model";
import { GameResultModel } from "../models/game-result.model";
import { GameModel } from "../models/game.model"

export interface GamesState {
    allGames: GameModel[],
    currentGame: GameDetailsModel|null,
    gameHubStatus: GameHubStatusEnum
}


export const changeGameHubStatus = createAction('games/changeGameHubStatus', props<{ status: GameHubStatusEnum }>());
export const loadGames = createAction('games/load', props<{games: GameModel[]}>() );
export const loadCurrentGame = createAction('games/loadCurrentGame', props<{game: GameDetailsModel|null}>());
export const changeGameConnectionState = createAction('games/changeGameConnectionState', props<{game: GamePlayersConnectionModel}>());
export const changeGameResult = createAction('games/changeGameResult', props<{game: GameResultModel}>());
export const newCoin = createAction('games/newCoin', props<{coin: CoinModel}>());

const initialState: GamesState = {
    allGames: [],
    currentGame: null,
    gameHubStatus: GameHubStatusEnum.NOT_CONNECTED
}

export const GamesReducer = createReducer(
    initialState,
    on(changeGameHubStatus, (state, payload) => {
        return { ...state, gameHubStatus: payload.status }
    }),
    on(loadGames, (state, payload) => {
        return { ...state, allGames: payload.games };
    }),
    on(loadCurrentGame, (state, payload) => {
        return { ...state, currentGame: payload.game };
    }),
    on(changeGameConnectionState, (state, payload) => {
        if(state.currentGame) {
            return { ...state, currentGame: { ...state.currentGame, ...payload.game }};
        }
        return { ...state }
    }),
    on(changeGameResult, (state, payload) => {
        if(state.currentGame) {
            return { ...state, currentGame: { ...state.currentGame, ...payload.game }};
        }
        return { ...state }
    }),
    on(newCoin, (state, payload) => {
        if(state.currentGame && state.currentGame.id === payload.coin.gameId) {
            state.currentGame.grid[payload.coin.column][payload.coin.height] = payload.coin.color;            
            return { ...state };
        }
        return { ...state }
    }),
); 