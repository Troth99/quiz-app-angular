import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  arrayUnion,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Achievement, User, UserAchievement } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  constructor(private firestore: Firestore) {}

  private injector = inject(Injector);

  getAllAchievements() {
    return runInInjectionContext(this.injector, () => {
      const firestore = inject(Firestore);
      const achievementCol = collection(firestore, 'achievements');
      return collectionData(achievementCol, { idField: 'id' }) as Observable<
        Achievement[]
      >;
    });
  }

  private achievementsConditions: {
    id: string;
    condition: (u: User) => boolean;
  }[] = [
    {
      id: 'first_quiz',
      condition: (u) => (u.quizStats?.quizzesTaken || 0) >= 1,
    },
    {
      id: 'perfect_score',
      condition: (u) =>
        u.recentQuizzes?.some((q) => q.score === q.total) ?? false,
    },
    {
      id: 'quiz_master',
      condition: (u) => (u.quizStats?.quizzesTaken || 0) >= 50,
    },
    { id: 'creator', condition: (u) => (u.createdQuizzies?.length || 0) >= 5 },
    {
      id: 'weekly_player',
      condition: (u) => (u.quizStats?.streakDays || 0) >= 7,
    },
    {
      id: 'explorer',
      condition: (u) => (u.quizStats?.uniqueCategories || 0) >= 5,
    },
  ];

  async checkAndUnlockAchievements(userId: string) {
    return runInInjectionContext(this.injector, async () => {
      const userRef = doc(this.firestore, 'users', userId);
      const docSnap = await getDoc(userRef);
      const user = docSnap.data() as User;
      if (!user) return;

      for (const achievement of this.achievementsConditions) {
        const alreadyUnlocked = user.achievements?.some(
          (ua: UserAchievement) => ua.id === achievement.id
        );
        if (!alreadyUnlocked && achievement.condition(user)) {
          return runInInjectionContext(this.injector, async () => {
            await updateDoc(userRef, {
              achievements: arrayUnion({
                id: achievement.id,
                unlockedAt: new Date().toISOString(),
              }),
            });
          });
        }
      }
    });
  }
}
