import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-quiz-home-component',
  imports: [ MatButtonModule, MatIconModule],
  templateUrl: './quiz-home-component.html',
  styleUrl: './quiz-home-component.css'
})
export class QuizHomeComponent {

  startQuizCategoryPage(): void {
    console.log('starting')
  }
}
