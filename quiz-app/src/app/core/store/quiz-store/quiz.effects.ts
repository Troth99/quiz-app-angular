import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import * as MyQuizzesActions from './quiz.actions';
import { QuizService } from "../../services/quiz.service";
import { AuthService } from "../../services";

@Injectable()
export class MyQuizzesEffects {

  private readonly actions$ = inject(Actions);
  private readonly quizService = inject(QuizService);
  private readonly auth = inject(AuthService);

  loadMyQuizzes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MyQuizzesActions.loadMyQuizzess),
      switchMap(() =>
        this.auth.authState().pipe(
          mergeMap(user => {
            if (!user) {
              return of(MyQuizzesActions.loadMyQuizzessSuccess({ quizzes: [] }));
            }

            return this.quizService.getQuizzesByUser(user.uid).pipe(
              map(quizzes => MyQuizzesActions.loadMyQuizzessSuccess({ quizzes })),
              catchError(error =>
                of(MyQuizzesActions.loadMyQuizzesFailure({ error }))
              )
            );
          })
        )
      )
    )
  );


 deleteQuiz$ = createEffect(() =>
  this.actions$.pipe(
    ofType(MyQuizzesActions.deleteQuiz),
    mergeMap(({ quizId, category }) =>
      this.quizService.deleteQuiz(category, quizId).pipe(
        map(() => MyQuizzesActions.deleteQuizSuccess({ quizId })),
        catchError((error) =>
          of(MyQuizzesActions.deleteQuizFailure({ error }))
        )
      )
    )
  )
);
}
