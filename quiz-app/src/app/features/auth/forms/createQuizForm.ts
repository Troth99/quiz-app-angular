import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Quiz } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class QuizCreateFormService {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      timeLimit: [null],
      shuffleQuestions: [false],
      category: ['', Validators.required],
      newCategoryName: [''],
      questions: this.fb.array([this.createQuestion()]),
    });
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }
  addQuestion() {
    this.questions.push(this.createQuestion());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  resetForm() {
    this.form.reset();
    this.questions.clear();
    this.addQuestion();
  }

  resetFormWithQuestions(count: number = 10) {
    this.form.reset();
    this.questions.clear();
    for (let i = 0; i < count; i++) {
      this.addQuestion();
    }
  }
  private createQuestion(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      type: ['multiple'],
      answers: this.fb.array([this.createAnswer(), this.createAnswer()]),
      correctAnswers: this.fb.array([]),
    });
  }

  public createAnswer(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false],
    });
  }

  public loadQuiz(data: Quiz): void {
    this.form.patchValue({
      title: data.title,
      description: data.description || '',
      timeLimit: data.timeLimit || null,
    });

    this.questions.clear();

    data.questions.forEach((question) => {
      const questionGroup = this.fb.group({
        text: [question.text, Validators.required],
        type: [question.type],
        answers: this.fb.array([]),
        correctAnswers: this.fb.array([]),
      });

      const answersArray = questionGroup.get('answers') as FormArray;
      if (question.answers && question.answers.length) {
        question.answers.forEach((answer) => {
          answersArray.push(
            this.fb.group({
              text: [answer.text, Validators.required],
              isCorrect: [answer.isCorrect || false],
            })
          );
        });
      } else {
        answersArray.push(this.createAnswer());
        answersArray.push(this.createAnswer());
      }

      const correctAnswersArray = questionGroup.get(
        'correctAnswers'
      ) as FormArray;
      if (question.correctAnswers && question.correctAnswers.length) {
        question.correctAnswers.forEach((ca) =>
          correctAnswersArray.push(this.fb.control(ca))
        );
      }

      this.questions.push(questionGroup);
    });
  }
}
