import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class StreakService {
  private injector = inject(Injector);

  constructor(private firestore: Firestore, private auth: Auth) {}

  async updateStreak(recentQuizzes: { date: string | Date }[]) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    const streakDays = this.calculateStreak(recentQuizzes);

    await runInInjectionContext(this.injector, async () => {
      const userRef = doc(this.firestore, 'users', currentUser.uid);
      await updateDoc(userRef, {
        'quizStats.streakDays': streakDays,
      });
    });
  }

  private calculateStreak(recentQuizzes: { date: string | Date }[]): number {
    if (!recentQuizzes || recentQuizzes.length === 0) return 0;

    recentQuizzes.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 1;

    for (let i = 1; i < recentQuizzes.length; i++) {
      const prev = new Date(recentQuizzes[i - 1].date);
      const current = new Date(recentQuizzes[i].date);

      const diffInDays = Math.floor((prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

      if (diffInDays === 1) {
        streak++;
      } else if (diffInDays > 1) {
        break;
      }
    }

    return streak;
  }
}
