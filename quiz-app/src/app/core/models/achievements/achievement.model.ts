export interface AchievementCondition {
    quizzesTaken?: number;
    scoreEqualsTotal?: boolean;
    createdQuizzies?: number;
    streakDays?: number;
    uniqueCategories?: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    condition: AchievementCondition;

}

export interface UserAchievement {
    id: string;
    unlockedAt: string;
}

export interface AchievementUi extends Achievement {
    unlockedAt? : string
}