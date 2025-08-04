import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "./quiz.reducer";


export const selectMyQuizzesState = createFeatureSelector<State>('myQuizzes');

export const selectMyQuizzes = createSelector(
    selectMyQuizzesState,
    (state) => state.quizzes
);


export const selectMyQuizzesLoading = createSelector(
    selectMyQuizzesState,
    (state) => state.loading
);

export const selectMyQuizzesError = createSelector(
  selectMyQuizzesState,
  (state) => state.error
);