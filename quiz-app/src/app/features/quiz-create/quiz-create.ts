import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../core/services/quiz.service';
import { Quiz } from '../../core/models';

@Component({
  selector: 'app-quiz-create',
  imports: [],
  templateUrl: './quiz-create.html',
  styleUrl: './quiz-create.css',
})
export class QuizCreate {
  constructor(private quizService: QuizService) {}


 test() {
  const quiz: Quiz = {
    title: 'Testing',
    description: 'Test desc',
    timeLimit: 10,
    questions: [
      {
        text: 'What is the capital of Bulgaria?',
        type: 'multiple',
        answers: [
          { text: 'Sofia', isCorrect: true },
          { text: 'Plovdiv', isCorrect: false },
          { text: 'Varna', isCorrect: false },
          { text: 'Burgas', isCorrect: false }
        ]
      }
    ],
    createdAt: new Date().toISOString()
  };

  this.quizService.addQuizToCategory('javascript', quiz).subscribe({
    next: () => console.log('Quiz added successfully.'),
    error: (err) => console.error('Error adding quiz:', err),
  });
}
}
