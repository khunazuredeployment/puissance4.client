import { createAction, createReducer, props, on } from "@ngrx/store"

export interface SessionState {
    id?: number,
    username?: string,
    token?: string,
    isConnected: boolean
}

const initialState: SessionState = {
    isConnected: false
}

export const start = createAction("session/start", props<{ id: number, username: string, token: string }>());
export const stop = createAction("session/stop");


export const SessionReducer = createReducer(
    initialState,
    on(start, (state, payload) => {        
        return { ...payload, isConnected: true };
    }),
    on(stop, () => initialState),
);