import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';

import { Quiz } from '../../../core/models';
import { QuizService } from '../../../core/services/quiz.service';
import { AuthService, UserService } from '../../../core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommentsComponent } from '../../comments-component/comments-component';
import { Loading } from '../../../shared';

@Component({
  selector: 'app-quiz-player',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatButtonModule,
    CommentsComponent,
    Loading,
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

  timeLeftSeconds = 0;
  private intervalId? : number;

  isLiking = false;

  currentUrl!: string;

  quizSubject = new BehaviorSubject<Quiz | null>(null);

  quiz$ = this.quizSubject.asObservable();

  private subscription!: Subscription;

  isLoggedIn = this.authService.isLoggedIn;

  newComment: string = '';
  comments: string[] = [];

  authorName = '';
  authorId = '';

  categoryName: string = '';
  quizId: string = '';

  private hasLikedSubject = new BehaviorSubject<boolean | null>(null);

  hasLiked$ = this.hasLikedSubject
    .asObservable()
    .pipe(filter((val): val is boolean => val !== null));
  loading = true;

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('categoryName') || '';
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    this.currentUrl = this.router.url;

    this.loading = true;

    this.subscription = this.authService
      .authState()
      .pipe(
        switchMap((user) => {
          if (!user) {
            this.hasLikedSubject.next(false);
            return of(null);
          }
          return this.quizService
            .hasLikedQuiz(this.categoryName, this.quizId, user.uid)
            .pipe(tap((hasLiked) => this.hasLikedSubject.next(hasLiked)));
        })
      )
      .subscribe();

    this.quizService
      .getQuizById(this.categoryName, this.quizId)
      .pipe(
        switchMap((quiz) => {
          if (!quiz) return of(null);
          return this.userService.getUser(quiz.createdBy).pipe(
            map((user) => {
              this.authorName = user?.displayName || 'Deleted user';
              this.authorId = user ? quiz.createdBy : '';
              return {
                ...quiz,
                likesCount: quiz.likesCount ?? 0,
              };
            })
          );
        }),
        catchError(() => of(null))
      )
      .subscribe({
        next: (quiz) => {
          this.quizSubject.next(quiz);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  reportBug() {
    if (!this.quizId) {
      return;
    }

    this.router.navigate([
      'quiz',
      this.categoryName,
      this.quizId,
      'report-bug',
    ]);
  }
  

  startQuiz(quiz: Quiz) {
    if (!this.isLoggedIn()) {
    this.router.navigate(['/auth/login'], { queryParams: { redirectUrl: this.currentUrl } });
    return;
  }

  

  this.router.navigate(['quiz-resolve', this.categoryName, this.quizId])

  }

  likeQuiz() {
  if (this.isLiking) return;

  const userId = this.userService.getCurrentUserId();
  if (!userId || !this.categoryName || !this.quizId) {
    return;
  }

  this.isLiking = true;
  this.hasLikedSubject.next(true);

  this.quizService.likeQuiz(this.categoryName, this.quizId, userId)
    .subscribe({
      next: () => {
        this.isLiking = false;
      },
      error: (err) => {
        console.error('Error liking quiz:', err.message);
        this.hasLikedSubject.next(false);
        this.isLiking = false;
      }
    });
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
