import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../../../core/models';
import { QuizService } from '../../../core/services/quiz.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiz-list-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz-list-component.html',
  styleUrls: ['./quiz-list-component.css']
})
export class QuizListComponent implements OnInit {
  @Input() category?: string;

  categoryName!: string;
  quizzess$!: Observable<Quiz[]>;

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipQuizId: string | number | null = null;

  private quizService = inject(QuizService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('categoryId') ?? this.category ?? '';

    if (this.categoryName) {
      this.quizzess$ = this.quizService.getTestByCategory(this.categoryName);
    }
  }

onMouseMove(event: MouseEvent, quizId: string | number | undefined): void {
  if (!quizId) return;
  this.tooltipVisible = true;
  this.tooltipQuizId = quizId;

  const target = event.target as HTMLElement;
  const container = target.closest('.quiz-container') as HTMLElement;

  if (!container) return;


  const rect = container.getBoundingClientRect();

  let posX = event.clientX - rect.left + 10;
  let posY = event.clientY - rect.top + 10;

  
  const tooltipWidth = 320;
  if (posX + tooltipWidth > rect.width) {
    posX = posX - tooltipWidth - 20;
  }

  this.tooltipX = posX;
  this.tooltipY = posY;
}

  onMouseLeave(): void {
    this.tooltipVisible = false;
    this.tooltipQuizId = null;
  }
}
