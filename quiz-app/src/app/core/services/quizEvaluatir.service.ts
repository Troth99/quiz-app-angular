import { Injectable } from '@angular/core';
import { Quiz } from '../models';

@Injectable({
  providedIn: 'root',
})
export class QuizEvaluatorService {
  evaluate(quiz: Quiz, selectedAnswers: { [quizIndex: number]: number[] }){

    let correctCount = 0;

    let wrongQuestions: number[] = [];

    quiz.questions.forEach((question, qIndex) => {
        const correctAnswersIndexes = question.answers?.map((a, i) => a.isCorrect ? i: -1).filter(i => i !== -1);

        const userAnswers = selectedAnswers[qIndex] || [];

        const isCorrect = correctAnswersIndexes?.length === userAnswers.length && correctAnswersIndexes.every(i => userAnswers.includes(i));

        if(isCorrect) {
            correctCount++
        }else {
            wrongQuestions.push(qIndex)
        }
    });

    return { correctCount, wrongQuestions }
  }
}
