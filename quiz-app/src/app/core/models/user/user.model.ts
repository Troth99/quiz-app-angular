import { Timestamp } from "firebase/firestore";
import { QuizStats } from "../quizzes/quiz-stats.model";
import { RecentQuiz } from "../quizzes/recentQuizes.model";

export interface User {
    displayName: string;
    email: string;
    photoUrl: string;
    createdAt: Date | null;
    lastLogin: Date| null;
    quizStats: QuizStats;
    recentQuizzes?: RecentQuiz[]
    createdQuizzies? : string[]
    lastDisplayNameChange? : Timestamp | Date   
}