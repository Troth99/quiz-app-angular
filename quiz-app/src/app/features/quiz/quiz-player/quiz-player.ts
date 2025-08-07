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

  private hasLikedSubject = new BehaviorSubject<boolean>(false);

  hasLiked$!: Observable<boolean>;

  loading = true;

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('categoryName') || '';
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    this.currentUrl = this.router.url;

    this.loading = true;

    this.subscription = this.authService.authState().subscribe((user) => {
      if (user) {
        this.quizService
          .hasLikedQuiz(this.categoryName, this.quizId, user.uid)
          .subscribe((hasLiked) => this.hasLikedSubject.next(hasLiked));
      } else {
        this.hasLikedSubject.next(false);
      }
    });

    this.hasLiked$ = this.hasLikedSubject.asObservable();

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
      console.error('Quiz id missing');
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
      this.router.navigate(['/login']);
      return;
    }
  }
  likeQuiz() {
    const userId = this.userService.getCurrentUserId();

    if (!userId || !this.categoryName || !this.quizId) {
      console.error('Missing data for like action.');
      return;
    }

    this.quizService
      .likeQuiz(this.categoryName, this.quizId, userId)
      .subscribe({
        next: () => {
          this.hasLikedSubject.next(true);
        },
        error: (err) => {
          console.error('Error liking quiz:', err.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
