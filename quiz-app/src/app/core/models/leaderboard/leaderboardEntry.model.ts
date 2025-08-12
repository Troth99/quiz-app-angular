export interface leaderboardEntry {
    id?: string;
  displayName: string;
  photoUrl? :  string;
  quizStats: {
    totalScore: number;
    quizzesTaken: number;
    timeSpent: number;
  }
}