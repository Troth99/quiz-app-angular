import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Quiz } from '../../core/models';
import { QuizCreateFormService } from '../auth/forms/createQuizForm';
import {
  ReactiveFormsModule,
  FormArray,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category } from '../../core/models/quizzes/category.model';
import { QuizService } from '../../core/services/quiz.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./edit-quiz.css'],
})
export class EditQuiz implements OnInit, OnDestroy {
  private quizId?: string | undefined | null;
  private categoryName?: string | undefined | null;

  private originalCreatedBy: string | undefined;

  private quizSub?: Subscription

  categories: Category[] = [];
  quizSaved = false;
  formService = inject(QuizCreateFormService);

  private router = inject(Router);

  private quizService = inject(QuizService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id');
    this.categoryName = this.route.snapshot.queryParamMap.get('category');

    if (!this.quizId || !this.categoryName) {
      return;
    }

    this.quizSub = this.quizService
      .getQuizById(this.categoryName, this.quizId)
      .subscribe((quiz) => {
        if (quiz) {
          this.loadQuizToForm(quiz);
        } else {
          console.warn('Quiz not found');
        }
      });
  }

  loadQuizToForm(quiz: Quiz) {
    this.originalCreatedBy = quiz.createdBy;
    this.formService.form.patchValue({
      title: quiz.title,
      description: quiz.description || '',
      category: quiz.category || '',
      timeLimit: quiz.timeLimit || null,
    });

    this.formService.questions.clear();

    quiz.questions.forEach((q) => {
      const questionGroup = this.formService['createQuestion']();

      questionGroup.patchValue({
        text: q.text,
        type: q.type,
      });

      const answersArray = questionGroup.get('answers') as FormArray;
      answersArray.clear();

      q.answers?.forEach((a) => {
        const answerGroup = this.formService.createAnswer();
        answerGroup.patchValue({
          text: a.text,
          isCorrect: a.isCorrect,
        });
        answersArray.push(answerGroup);
      });

      this.formService.questions.push(questionGroup);
    });
  }

  onSubmit() {
    if (this.formService.form.valid) {
      const updateQuiz = {
        ...this.formService.form.value,
        createdBy: this.originalCreatedBy,
      };

      if (this.categoryName && this.quizId) {
        this.quizService
          .updateQuiz(this.categoryName, this.quizId, updateQuiz)
          .subscribe({
            next: () => {
              this.quizSaved = true;
            },
            error: (err) => {
              console.error('Update failed', err);
            },
          });
      } else {
        console.error('Missing category or quiz ID');
      }
    }
  }

  addAnswer(questionIndex: number) {
    const answers = this.formService.questions
      .at(questionIndex)
      .get('answers') as FormArray;
    answers.push(this.formService.createAnswer());
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const answers = this.formService.questions
      .at(questionIndex)
      .get('answers') as FormArray;
    answers.removeAt(answerIndex);
  }

  getAnswersControls(questionGroup: AbstractControl) {
    return (questionGroup.get('answers') as FormArray).controls;
  }

  goBack() {
    this.router.navigate(['/profile/my-created-quizzes']);
  }

  ngOnDestroy(): void {
    this.quizSub?.unsubscribe()
  }
}
