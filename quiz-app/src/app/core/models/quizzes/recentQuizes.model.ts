import { Timestamp } from "@angular/fire/firestore";


export interface RecentQuiz {
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  date: Date | Timestamp;
}