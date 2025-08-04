import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Quiz } from '../../core/models';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../core/pipes/time-ago.pipe';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectMyQuizzes, selectMyQuizzesLoading } from '../../core/store/quiz-store/quiz.selectors';
import { deleteQuiz, loadMyQuizzess } from '../../core/store/quiz-store/quiz.actions';
import { Loading } from '../../shared';

@Component({
  selector: 'app-my-created-quizzes',
  imports: [CommonModule, TimeAgoPipe, Loading],
  templateUrl: './my-created-quizzes.html',
  styleUrl: './my-created-quizzes.css',
})
export class MyCreatedQuizzes implements OnInit {
  
  private router = inject(Router);
  private store = inject(Store)

  myQuizzess$: Observable<Quiz[]>  = this.store.select(selectMyQuizzes);
  loading$: Observable<boolean> =this.store.select(selectMyQuizzesLoading)

  ngOnInit(): void {
    this.store.dispatch(loadMyQuizzess())
  }

  editQuiz(quizId: string | undefined, category: string | undefined): void {
    if (!quizId || !category) {
      return;
    }

    this.router.navigate(['/profile/edit', quizId], {
      queryParams: { category },
    });
  }

 deleteQuiz(quizId: string | undefined, category: string | undefined): void {
  if (!quizId || !category) return;
  const confirmed = confirm("Are you sure you want to delete the quiz?");
  if (!confirmed) return;

  this.store.dispatch(deleteQuiz({ quizId, category }));
}

 
 
}
