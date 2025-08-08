import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of } from 'rxjs';
import { Quiz } from '../../../core/models';
import { Loading } from '../../../shared';
import { QuizTimerService } from '../../../core/services/quizTimerService..serive';
import { QuizStateService } from '../../../core/services/quizState.service';


@Component({
  selector: 'app-quiz-resolver',
  standalone: true,
  imports: [CommonModule, Loading],
  templateUrl: './quiz-resolver.html',
  styleUrls: ['./quiz-resolver.css'],
})
export class QuizResolver implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);
  private quizTimerService = inject(QuizTimerService);
  private quizState = inject(QuizStateService);


  quiz$!: Observable<Quiz | null>;
  quiz?: Quiz | null;

  selectedAnswers: { [questionIndex: number]: number[] } = {};

  timeLeftSeconds = 0;
  private intervalId?: number;



  ngOnInit() {
    const categoryName = this.route.snapshot.paramMap.get('categoryName') || '';
    const quizId = this.route.snapshot.paramMap.get('quizId') || '';

    this.quiz$ = this.quizService.getQuizById(categoryName, quizId).pipe(catchError(() => of(null)));
    this.quiz$.subscribe(q => this.quiz = q);

    this.quizState.setActive(true)

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
    this.timeLeftSeconds = Math.floor(this.quizTimerService.getTimeLeft() / 1000);
    if (this.timeLeftSeconds <= 0) {
     this.quizTimerService.stop()
      this.onTimeExpired();
    }
  }

  onTimeExpired() {
    this.quizState.setActive(false)
    alert('Time run out');
  
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
      this.selectedAnswers[questionIndex] = this.selectedAnswers[questionIndex].filter(i => i !== answerIndex);
    }
  }

  submit() {
    this.quizState.setActive(false)
    this.quizTimerService.stop()
    console.log(this.selectedAnswers);
  }

get questionsWithIndex() {
  return this.quiz?.questions.map((question, qIndex) => ({
    question,
    qIndex,
    answersWithIndex: question.answers?.map((answer, aIndex) => ({ answer, aIndex })) || []
  })) || [];
}
get formattedTime(): string {
  const minutes = Math.floor(this.timeLeftSeconds / 60);
  const seconds = this.timeLeftSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

  ngOnDestroy() {

  }
}
