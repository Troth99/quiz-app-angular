import { createAction, props } from '@ngrx/store';
import { Quiz } from '../../models';

export const loadMyQuizzess = createAction('[My Quizzes] Load my Quizzes');

export const loadMyQuizzessSuccess = createAction(
  '[My Quizzes] Load My Quizzes Success',
  props<{ quizzes: Quiz[] }>()
);

export const loadMyQuizzesFailure = createAction(
      '[My Quizzes] Load My Quizzes Failure',
  props<{ error: Error}>()
)


export const deleteQuiz = createAction(
    '[My Quizzes] Delete Quiz',
  props<{ quizId: string; category: string }>()
);

export const deleteQuizSuccess = createAction(
  '[My Quizzes] Delete Quiz Success',
  props<{ quizId: string }>()
);

export const deleteQuizFailure = createAction(
  '[My Quizzes] Delete Quiz Failure',
  props<{ error: Error }>()
);