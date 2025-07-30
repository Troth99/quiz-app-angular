import { Component, inject, input, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../../../core/models';
import { QuizService } from '../../../core/services/quiz.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz-list-component',
  imports: [CommonModule],
  templateUrl: './quiz-list-component.html',
  styleUrl: './quiz-list-component.css'
})
export class QuizListComponent implements OnInit {
@Input() category? : string

categoryName!: string;

  private quizService = inject(QuizService)
  private route = inject(ActivatedRoute)

  quizzess$!: Observable<Quiz[]>;

ngOnInit(): void {
  this.categoryName = this.route.snapshot.paramMap.get('categoryId') ?? "";

  if(this.categoryName){
    this.quizzess$ = this.quizService.getTestByCategory(this.categoryName)
  }
}
  
}
