import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuizService } from '../../core/services/quiz.service';
import { Quiz } from '../../core/models';
import { QuizCreateFormService } from '../auth/forms/createQuizForm';
import { Category } from '../../core/models/quizzes/category.model';
import { Question } from '../../core/models/quizzes/questions.model';
import { AbstractControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './quiz-create.html',
  styleUrl: './quiz-create.css',
})
export class QuizCreate implements OnInit, OnDestroy {
  categories: Category[] = [];

   private subscriptions = new Subscription();
   
  constructor(
    private quizService: QuizService,
    public formService: QuizCreateFormService,
  ) {}

  ngOnInit(): void {
   const categorySub = this.quizService.getCategories().subscribe(categories => {
     this.categories = categories
  
  
  });
   this.subscriptions.add(categorySub)
  

    this.formService.resetForm();

    while (this.formService.questions.length < 10) {
      this.formService.addQuestion();
    }

  }

  onSubmit(): void {
    if (this.formService.form.invalid) {
      console.warn('Form is not valid');
      return;
    }
    const formValue = this.formService.form.value;

    const categoryName = formValue.category || formValue.newCategoryName;

    const quiz: Quiz = {
      title: formValue.title,
      description: formValue.description || '',
      timeLimit: formValue.timeLimit || 0,
      createdAt: new Date().toISOString(),
      questions: formValue.questions.map((q: Question) => ({
        text: q.text,
        type: q.type,
        answers: q.answers,
      })),
    };

 this.quizService.createCategory(categoryName).subscribe({
    next: () => {
   
      this.quizService.addQuizToCategory(categoryName, quiz).subscribe({
        next: (quizId) => {
          console.log('Quiz created with id:', quizId);
        
        },
        error: (err) => console.error('Error adding quiz:', err),
      });
    },
    error: (err) => console.error('Error creating category:', err),
  });

  }

  addAnswer(questionIndex: number) {
    const answersArray = this.formService.questions.at(questionIndex).get('answers') as FormArray;
    if (answersArray && 'push' in answersArray) {
      answersArray.push(this.formService.createAnswer());
    }
  }

removeAnswer(questionIndex: number, answerIndex: number) {
  const answersArray = this.formService.questions.at(questionIndex).get('answers') as FormArray;
  answersArray.removeAt(answerIndex);
}
  getAnswersControls(q: AbstractControl): AbstractControl[] {
  return (q.get('answers') as FormArray).controls;
}

ngOnDestroy(): void {
  this.subscriptions.unsubscribe()
}
}

