import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { QuizService } from '../../../core/services/quiz.service';
import { finalize, Observable, Subscription, tap } from 'rxjs';
import { Category } from '../../../core/models/quizzes/category.model';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Loading } from '../../../shared';

@Component({
  selector: 'app-quiz-category',
  imports: [CommonModule, Loading],
  templateUrl: './quiz-category.html',
  styleUrl: './quiz-category.css',
})
export class QuizCategory implements OnInit, OnDestroy {

  
  private quizService = inject(QuizService);
  private router = inject(Router);
  
  categories: Category[] = [];

  private subscription!: Subscription
  
  isLoading = true; 
  ngOnInit(): void {
    this.subscription = this.quizService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err)
        this.isLoading = false;
      }
    })
  }

  selectCategory(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/quiz/categories', id, 'tests'])
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
