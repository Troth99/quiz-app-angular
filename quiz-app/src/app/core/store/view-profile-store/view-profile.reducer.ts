import { createReducer, on } from "@ngrx/store";
import { User } from "../../models";
import * as UserActions from "./view-profile.actions"



export interface UserState {
    selectedUser: User | null;
    loading: boolean;
    error: Error| null
}

export const initialState: UserState = {
    selectedUser: null,
    loading: false,
    error: null,
}
export const userReducer = createReducer(
  initialState,
  on(UserActions.loadViewUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
  })),
  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);