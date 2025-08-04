import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Quiz } from '../../core/models';
import { QuizService } from '../../core/services/quiz.service';
import { AuthService } from '../../core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../core/pipes/time-ago.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-created-quizzes',
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './my-created-quizzes.html',
  styleUrl: './my-created-quizzes.css',
})
export class MyCreatedQuizzes implements OnInit, OnDestroy {
  myQuizzess$: Observable<Quiz[]> | undefined;

  private quizService = inject(QuizService);

  private authService = inject(AuthService);

  private subscription = new Subscription();

  private router = inject(Router);

  ngOnInit(): void {
    this.subscription.add(
      this.authService.authState().subscribe((user) => {
        if (user) {
          this.myQuizzess$ = this.quizService.getQuizzesByUser(user.uid);
          this.myQuizzess$.subscribe((quizzes) => {
            console.log('Loaded quizzes:', quizzes);
          });
        } else {
          this.myQuizzess$ = undefined;
        }
      })
    );
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

    const confirmed = confirm("Are you sure you wan't to delete the quiz?");
    if (!confirmed) return;

    this.quizService.deleteQuiz(category, quizId).subscribe({
      next: () => {
        this.loadQuizzes();
      },
      error: (err) => console.error('Delete failed', err),
    });
  }

  loadQuizzes() {
    this.authService.authState().subscribe((user) => {
      if (user) {
        this.myQuizzess$ = this.quizService.getQuizzesByUser(user.uid);
      } else {
        this.myQuizzess$ = undefined;
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
