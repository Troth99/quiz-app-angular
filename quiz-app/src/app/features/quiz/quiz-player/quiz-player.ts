import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Quiz } from '../../../core/models';
import { QuizService } from '../../../core/services/quiz.service';
import { AuthService, UserService } from '../../../core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-quiz-player',
  imports: [RouterLink, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './quiz-player.html',
  styleUrl: './quiz-player.css'
})
export class QuizPlayer implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizService = inject(QuizService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  currentUrl!: string;

  quizId: string | null = null;
  quiz$!: Observable<Quiz>;
  private subscription!: Subscription;

  isLoggedIn = this.authService.isLoggedIn;

  newComment: string = '';
  comments: string[] = []

  authorName = '';
  authorId = '';


  ngOnInit(): void {
    this.currentUrl = this.router.url;

    this.quiz$ = this.route.paramMap.pipe(
      filter(params => params.has('categoryName') && params.has('id')),
      switchMap(params => {
        const categoryName = params.get('categoryName')!;
        const quizId = params.get('id')!;
        return this.quizService.getQuizById(categoryName, quizId);
      }),
      filter((quiz): quiz is Quiz => quiz !== null),
      switchMap(quiz => {
        this.authorId = quiz.createdBy;
        return this.userService.getUser(this.authorId).pipe(
          tap(user => {
            if(user) {
              this.authorName = user.displayName
            }else {
              this.authorName = 'Deleted user';
              this.authorId = ''
            }
          }),
          map(() => quiz)
        )
      })
    );

 
    this.subscription = this.quiz$.subscribe();
  }
  //TODO to implement new commponent to view user profile
  reportBug() {

  }

  addComment(){

  }
  startQuiz(quiz: Quiz) {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
   
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
