import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quiz-home-component',
  imports: [ MatButtonModule, MatIconModule],
  templateUrl: './quiz-home-component.html',
  styleUrl: './quiz-home-component.css'
})
export class QuizHomeComponent {

constructor(private router: Router){}

  startQuizCategoryPage(): void {
    this.router.navigate(['/quiz/categories'])
  }
}
