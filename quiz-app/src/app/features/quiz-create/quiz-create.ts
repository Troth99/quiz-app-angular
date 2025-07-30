import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { QuizService } from '../../core/services/quiz.service';
import { Quiz } from '../../core/models';
import { QuizCreateFormService } from '../auth/forms/createQuizForm';
import { Category } from '../../core/models/quizzes/category.model';
import { Question } from '../../core/models/quizzes/questions.model';
import { AbstractControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subscription, switchMap, take, tap } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../../core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-quiz-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './quiz-create.html',
  styleUrl: './quiz-create.css',
})
export class QuizCreate implements OnInit, OnDestroy {
  categories: Category[] = [];
  quizCreated = false;

createdQuizId: string | null = null;
createdCategory: string | null = null;

   private subscriptions = new Subscription();
   private auth = inject(Auth)
   private userService = inject(UserService)
   
  constructor(
    private quizService: QuizService,
    public formService: QuizCreateFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
   const categorySub = this.quizService.getCategories().subscribe(categories => {
     this.categories = categories
  
  
  });
   this.subscriptions.add(categorySub)
  
    this.formService.resetFormWithQuestions(10)
  }

 onSubmit(): void {
  const user = this.auth.currentUser;

  if (!user?.uid) {
    console.warn('no user logged in');
    return;
  }

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
    createdBy: user.uid,
    questions: formValue.questions.map((q: Question) => ({
      text: q.text,
      type: q.type,
      answers: q.answers,
    })),
  };
  
  //using swich map to avoid leaking of the constantly adding ID's
  this.quizService.createCategory(categoryName).pipe(
    switchMap(() => this.quizService.addQuizToCategory(categoryName, quiz)),
    switchMap((quizId) => 
      this.userService.getUser(user.uid).pipe(
        take(1),
        switchMap((userData) => {
          const updatedQuizzes = [...(userData.createdQuizzies || [])];
          if (!updatedQuizzes.includes(quizId)) {
            updatedQuizzes.push(quizId);
          }

          return this.userService.updateUser(user.uid, {
            createdQuizzies: updatedQuizzes,
          }).pipe(
            tap(() => {
        
              this.quizCreated = true;
              this.createdQuizId = quizId;
              this.createdCategory = categoryName;
            })
          );
        })
      )
    ),
  ).subscribe({
    error: (err) => {
      console.error('Error creating quiz', err);
    }
  });
}

  addAnswer(questionIndex: number) {
    const answersArray = this.formService.questions.at(questionIndex).get('answers') as FormArray;
    
    if(answersArray && answersArray.length < 6){
      answersArray.push(this.formService.createAnswer());

    }else {
      console.warn('Maximum 6 asnwers are allowed')
    }
  }

removeAnswer(questionIndex: number, answerIndex: number) {
  const answersArray = this.formService.questions.at(questionIndex).get('answers') as FormArray;
  answersArray.removeAt(answerIndex);
}
  getAnswersControls(q: AbstractControl): AbstractControl[] {
  return (q.get('answers') as FormArray).controls;
}

goToCreatedQuiz(){
    this.router.navigate(['profile/my-created-quizzes'])
}

resetForm(): void {
  this.quizCreated = false;
  this.createdQuizId = null;
  this.createdCategory = null;
  this.formService.resetFormWithQuestions(10)
}
ngOnDestroy(): void {
  this.subscriptions.unsubscribe()
}
}

