import { createAction, createReducer, props, on } from "@ngrx/store"
import { AuthModel } from "src/app/features/auth/models/auth.model";

export interface SessionState {
    id?: number,
    username?: string,
    token?: string,
    isConnected: boolean
}

const initialState: SessionState = {
    isConnected: false
}

export const start = createAction("session/start", props<{ auth: AuthModel }>());
export const stop = createAction("session/stop");

export const SessionReducer = createReducer(
    initialState,
    on(start, (state, payload) => {        
        return { ...payload.auth, isConnected: true };
    }),
    on(stop, () => initialState),
);