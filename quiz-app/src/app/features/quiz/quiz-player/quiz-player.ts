import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Quiz } from '../../../core/models';
import { QuizService } from '../../../core/services/quiz.service';
import { AuthService, UserService } from '../../../core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommentsComponent } from '../../comments-component/comments-component';

@Component({
  selector: 'app-quiz-player',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatButtonModule,
    CommentsComponent,
  ],
  templateUrl: './quiz-player.html',
  styleUrl: './quiz-player.css',
  standalone: true,
})
export class QuizPlayer implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizService = inject(QuizService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  currentUrl!: string;

  quiz$!: Observable<Quiz>;
  private subscription!: Subscription;

  isLoggedIn = this.authService.isLoggedIn;

  newComment: string = '';
  comments: string[] = [];

  authorName = '';
  authorId = '';

  categoryName: string = '';
  quizId: string = '';

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('categoryName') || '';
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    this.currentUrl = this.router.url;

    this.quiz$ = this.quizService
      .getQuizById(this.categoryName, this.quizId)
      .pipe(
        filter((quiz): quiz is Quiz => !!quiz),
        switchMap((quiz) => {
          this.authorId = quiz.createdBy;
          return this.userService.getUser(this.authorId).pipe(
            tap((user) => {
              this.authorName = user?.displayName || 'Deleted user';
              if (!user) this.authorId = '';
            }),
            map(() => quiz)
          );
        })
      );

    this.subscription = this.quiz$.subscribe();
  }
  reportBug() {}

  startQuiz(quiz: Quiz) {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  likeQuiz() {
    //to do likes
  }

  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
