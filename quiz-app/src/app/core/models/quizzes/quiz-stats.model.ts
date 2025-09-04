export interface QuizStats {
    lastQuizDate: Date | null;
    quizzesTaken: number;
    timeSpent: number;
    totalScore: number;
    streakDays: number;
    uniqueCategories: number;
}