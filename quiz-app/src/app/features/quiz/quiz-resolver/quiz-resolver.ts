import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of } from 'rxjs';
import { Quiz } from '../../../core/models';
import { Loading } from '../../../shared';
import { QuizTimerService } from '../../../core/services/quizTimerService..serive';
import { QuizStateService } from '../../../core/services/quizState.service';
import { QuizEvaluatorService } from '../../../core/services/quizEvaluatir.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { UserService } from '../../../core';
import { MatButtonModule } from '@angular/material/button';
import { QuizTimeExpired } from '../quiz-time-expired/quiz-time-expired';


@Component({
  selector: 'app-quiz-resolver',
  standalone: true,
  imports: [CommonModule, Loading, MatDialogModule, MatButtonModule],
  templateUrl: './quiz-resolver.html',
  styleUrls: ['./quiz-resolver.css'],
})
export class QuizResolver implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);
  private quizTimerService = inject(QuizTimerService);
  private quizState = inject(QuizStateService);
  private evaluator = inject(QuizEvaluatorService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private userService = inject(UserService);

  result?: { correctCount: number; wrongQuestions: number[] };

  quiz$!: Observable<Quiz | null>;
  quiz?: Quiz | null;

  selectedAnswers: { [questionIndex: number]: number[] } = {};

  timeLeftSeconds = 0;
  private intervalId?: number;

  previewMode = false;

  ngOnInit() {
    const categoryName = this.route.snapshot.paramMap.get('categoryName') || '';
    const quizId = this.route.snapshot.paramMap.get('quizId') || '';

    this.quiz$ = this.quizService
      .getQuizById(categoryName, quizId)
      .pipe(catchError(() => of(null)));
    this.quiz$.subscribe((q) => (this.quiz = q));

    this.quizState.setActive(true);

    this.quizTimerService.start();

    this.startTimerInterval();
  }

  startTimerInterval() {
    this.updateTimeLeft();
    this.intervalId = window.setInterval(() => {
      this.updateTimeLeft();
    }, 1000);


  }

  updateTimeLeft() {
    this.timeLeftSeconds = Math.floor(
      this.quizTimerService.getTimeLeft() / 1000
    );
    if (this.timeLeftSeconds <= 0) {
      this.quizTimerService.stop();
      this.onTimeExpired();
    }
  }

onTimeExpired() {
  this.quizState.setActive(false);
  this.quizTimerService.stop();
  this.timeLeftSeconds = 0
  
  const dialogRef = this.dialog.open(QuizTimeExpired);
  
  dialogRef.afterClosed().subscribe(() => {
    const categoryName = this.route.snapshot.paramMap.get('categoryName') || '';
    const quizId = this.route.snapshot.paramMap.get('quizId') || '';
    
    this.router.navigate(['/quiz/play', categoryName, quizId]);
  });
}

  onCheckboxChange(questionIndex: number, answerIndex: number, event: Event) {
    if (this.timeLeftSeconds <= 0) return;

    const checked = (event.target as HTMLInputElement).checked;

    if (!this.selectedAnswers[questionIndex]) {
      this.selectedAnswers[questionIndex] = [];
    }

    if (checked) {
      this.selectedAnswers[questionIndex].push(answerIndex);
    } else {
      this.selectedAnswers[questionIndex] = this.selectedAnswers[
        questionIndex
      ].filter((i) => i !== answerIndex);
    }
  }
  openConfirm() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { message: 'Are you sure you want to continioue?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.submit();
      }
    });
  }
  submit() {
    if (!this.quiz) {
      return;
    }

    this.quizState.setActive(false);

    this.result = this.evaluator.evaluate(this.quiz, this.selectedAnswers);

    const timeSpent = this.quizTimerService.getElapsedTimeSeconds();

    this.quizTimerService.stop();

    this.userService
      .updateQuizStats(
        {
          quizzesTaken: 1,
          totalScore: this.result.correctCount,
          timeSpent,
        },
        {
          quizId: this.quiz.id ?? '',
          quizTitle: this.quiz.title,
          score: this.result.correctCount,
          total: this.quiz.questions.length,
          date: new Date(),
        }
      )
      .subscribe({
        error: (err) => console.error('Error updating stats', err),
      });
  }
  get questionsWithIndex() {
    return (
      this.quiz?.questions.map((question, qIndex) => ({
        question,
        qIndex,
        answersWithIndex:
          question.answers?.map((answer, aIndex) => ({ answer, aIndex })) || [],
      })) || []
    );
  }
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeftSeconds / 60);
    const seconds = this.timeLeftSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  previewQuiz(): void {
    this.previewMode = true;
  }

  closePreview() {
    this.previewMode = false;
  }

  isAnswerSelected(questionIndex: number, answerIndex: number): boolean {
    return (
      this.selectedAnswers?.[questionIndex]?.includes(answerIndex) || false
    );
  }

  isAnswerMissed(questionIndex: number, answerIndex: number): boolean {
    if (!this.quiz) return false;
    const question = this.quiz.questions?.[questionIndex];
    if (!question) return false;
    const answer = question.answers?.[answerIndex];
    if (!answer) return false;

    return (
      answer.isCorrect && !this.isAnswerSelected(questionIndex, answerIndex)
    );
  }
  isAnswerCorrect(questionIndex: number, answerIndex: number): boolean {
    if (!this.quiz) return false;
    const question = this.quiz.questions?.[questionIndex];
    if (!question) return false;
    const answer = question.answers?.[answerIndex];
    return (
      answer?.isCorrect === true &&
      this.isAnswerSelected(questionIndex, answerIndex)
    );
  }

  isAnswerWrong(questionIndex: number, answerIndex: number): boolean {
    if (!this.quiz) return false;
    const question = this.quiz.questions?.[questionIndex];
    if (!question) return false;

    const answer = question.answers?.[answerIndex];
    if (!answer) return false;

    return (
      this.isAnswerSelected(questionIndex, answerIndex) && !answer.isCorrect
    );
  }
  get safeQuestions() {
    return this.quiz?.questions ?? [];
  }

  moreQuizzes() {
    this.router.navigate(['quiz/categories']);
  }
  ngOnDestroy() {}
}
