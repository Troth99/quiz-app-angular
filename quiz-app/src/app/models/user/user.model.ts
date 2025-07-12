import { QuizStats } from "../quizzes/quiz-stats.model";

export interface User {
    displayName: string;
    email: string;
    photoUrl: string;
    createdAt: Date | null;
    lastLogin: Date| null;
    quizStats: QuizStats;
}