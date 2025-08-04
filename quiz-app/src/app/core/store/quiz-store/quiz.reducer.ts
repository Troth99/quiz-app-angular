import { createReducer, on } from '@ngrx/store';
import { Quiz } from '../../models';
import * as MyQuizzesActions from './quiz.actions';

export interface State {
  quizzes: Quiz[];
  loading: boolean;
  error: Error | null;
}

export const initialState: State = {
  quizzes: [],
  loading: false,
  error: null,
};

export const myQuizzesReducer = createReducer(
  initialState,

  on(MyQuizzesActions.loadMyQuizzess, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(MyQuizzesActions.loadMyQuizzessSuccess, (state, {quizzes}) => ({
    ...state,
    quizzes,
    loading: false,
    error: null,
  })),

   on(MyQuizzesActions.loadMyQuizzesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(MyQuizzesActions.deleteQuizSuccess, (state, { quizId }) => ({
  ...state,
  quizzes: state.quizzes.filter(q => q.id !== quizId)
})),
);
