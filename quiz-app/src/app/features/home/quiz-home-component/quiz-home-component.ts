import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz-home-component',
  imports: [],
  templateUrl: './quiz-home-component.html',
  styleUrl: './quiz-home-component.css'
})
export class QuizHomeComponent {
  public counter = 0;

  increaseNumber() {
    this.counter++
  
  }

  resetTimer(){
    this.counter = 0
  }
}
