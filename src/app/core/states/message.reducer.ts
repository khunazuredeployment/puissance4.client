import { createAction, createReducer, props, on } from "@ngrx/store"

export interface MessageState {
    severity?: string;
    summary?: string; 
    sticky?: boolean;
}

const initialState: MessageState = {
}

export const addMessage = createAction("message/add", props<{ severity: string, summary: string, sticky: boolean }>());


export const MessageReducer = createReducer(
    initialState,
    on(addMessage, (state, payload) => {        
        return { ...payload };
    }),
);