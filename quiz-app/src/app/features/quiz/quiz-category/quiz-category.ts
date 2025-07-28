import { Component, inject, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { QuizService } from '../../../core/services/quiz.service';
import { Observable } from 'rxjs';
import { Category } from '../../../core/models/quizzes/category.model';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-quiz-category',
  imports: [CommonModule],
  templateUrl: './quiz-category.html',
  styleUrl: './quiz-category.css',
})
export class QuizCategory implements OnInit {

  private quizService = inject(QuizService);
  private router = inject(Router);

  selectedCategoryId: string | null = null;

  categories$!: Observable<Category[]>;

  ngOnInit(): void {
    this.categories$ = this.quizService.getCategories();
  }

  selectCategory(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/quiz/categories', id, 'tests'])
  }
}
