import { createAction, createReducer, props, on } from "@ngrx/store"
import { MessageModel } from "src/app/features/game/models/message.model";

export interface MessagesState {
    message: MessageModel|null;
}

const initialState: MessagesState = {
    message: null,
}

export const newMessage = createAction("messages/newMessage", props<{ message: MessageModel }>());

export const MessagesReducer = createReducer(
    initialState,
    on(newMessage, (state, payload) => {        
        return { ...payload };
    })
);