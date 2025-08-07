import { Component, inject, Input, OnInit } from '@angular/core';
import { finalize, Observable, startWith, tap } from 'rxjs';
import { Quiz } from '../../../core/models';
import { QuizService } from '../../../core/services/quiz.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Loading } from '../../../shared';

@Component({
  selector: 'app-quiz-list-component',
  standalone: true,
  imports: [CommonModule, RouterLink, Loading],
  templateUrl: './quiz-list-component.html',
  styleUrls: ['./quiz-list-component.css']
})
export class QuizListComponent implements OnInit {
  @Input() category?: string;

  categoryName!: string;
  quizzes: Quiz[] = [];
  isLoading = true;

 

  private quizService = inject(QuizService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('categoryId') ?? this.category ?? '';

    if (this.categoryName) {
      this.isLoading = true;
      this.quizService.getTestByCategory(this.categoryName).subscribe({
        next: quizzes => {
          this.quizzes = quizzes;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  checkIfCompelte(quiz: Quiz): boolean {
    return !!quiz.completedByUser;
  }
}