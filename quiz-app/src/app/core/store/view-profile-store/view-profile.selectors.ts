import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./view-profile.reducer";


export const selectUserState = createFeatureSelector<UserState>('viewUser');

export const selectedUser = createSelector(
  selectUserState,
  (state) => state.selectedUser
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error
);