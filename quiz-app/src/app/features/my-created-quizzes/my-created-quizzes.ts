import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Quiz } from '../../core/models';
import { QuizService } from '../../core/services/quiz.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from '../../core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-created-quizzes',
  imports: [CommonModule],
  templateUrl: './my-created-quizzes.html',
  styleUrl: './my-created-quizzes.css',
})
export class MyCreatedQuizzes implements OnInit, OnDestroy {
  myQuizzess$: Observable<Quiz[]> | undefined;

  private quizService = inject(QuizService);

  private authService = inject(AuthService);

   private subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.authService.authState().subscribe((user) => {
        if (user) {
          this.myQuizzess$ = this.quizService.getQuizzesByUser(user.uid);
  
        } else {
          this.myQuizzess$ = undefined;
        }
      })
    );
  }

  editQuiz(quizId: string | undefined): void {

    console.log('Edit quiz', quizId);
  }

  deleteQuiz(quizId: string | undefined): void {
   
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
