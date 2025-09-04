import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  Timestamp,
  arrayUnion,
  collection,
  collectionData,
  doc,
  docData,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { User } from '../models';
import { Auth } from '@angular/fire/auth';
import { RecentQuiz } from '../models/quizzes/recentQuizes.model';
import { StreakService } from './streak.service';
import { AchievementService } from './achievement.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  updateUser(uid: string, data: Partial<User>): Observable<void> {
    return runInInjectionContext(this.injector, () => {
      const userDocRef = doc(this.firestore, 'users', uid);
      return from(updateDoc(userDocRef, data));
    });
  }

  constructor(
    private firestore: Firestore,
    private injector: Injector,
    private auth: Auth,
    private streakService: StreakService,
    private achievementService: AchievementService
  ) {}

  getUser(uid: string): Observable<User> {
    return runInInjectionContext(this.injector, () => {
      const userDoc = doc(this.firestore, `users/${uid}`);
      return docData(userDoc) as Observable<User>;
    });
  }

  getAllUsers(): Observable<User[]> {
    return runInInjectionContext(this.injector, () => {
      const userRef = collection(this.firestore, 'users');
      return collectionData(userRef, { idField: 'id' }) as Observable<User[]>;
    });
  }

  updateLogin(uid: string): Observable<void | undefined> {
    return runInInjectionContext(this.injector, () => {
      const userDocRef = doc(this.firestore, 'users', uid);

      return from(getDoc(userDocRef)).pipe(
        switchMap((snapshot) => {
          if (snapshot.exists()) {
            return runInInjectionContext(this.injector, () => {
              return from(updateDoc(userDocRef, { lastLogin: new Date() }));
            });
          }
          return of(undefined);
        })
      );
    });
  }

  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  addQuizToUser(uid: string, quizId: string): Observable<void> {
    return runInInjectionContext(this.injector, () => {
      const userDocRef = doc(this.firestore, 'users', uid);

      return from(getDoc(userDocRef)).pipe(
        switchMap((snapshot) => {
          if (!snapshot.exists()) {
            throw new Error('User not found');
          }
          const userData = snapshot.data() as User;

          const createdQuizzies = userData.createdQuizzies || [];

          if (!createdQuizzies.includes(quizId)) {
            createdQuizzies.push(quizId);
          }

          return from(updateDoc(userDocRef, { createdQuizzies }));
        })
      );
    });
  }

  isDisplayNameTaken(displayName: string): Observable<boolean> {
    return runInInjectionContext(this.injector, () => {
      const displayNameLower = displayName.toLowerCase();
      const usersRef = collection(this.firestore, 'users');
      const q = query(
        usersRef,
        where('displayNameLower', '==', displayNameLower)
      );

      return from(getDocs(q)).pipe(map((snapshot) => !snapshot.empty));
    });
  }

updateQuizStats(
  statsUpdate: {
    quizzesTaken: number;
    totalScore: number;
    timeSpent: number;
  },
  recentQuiz: RecentQuiz
): Observable<void> {
  return from(
    runInInjectionContext(this.injector, async () => {
      const userRef = doc(this.firestore, `users/${this.getCurrentUserId()}`);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let recentQuizzes: RecentQuiz[] = data?.['recentQuizzes'] || [];

        recentQuizzes.push(recentQuiz);

        recentQuizzes.sort((a, b) => {
          const getTime = (d: RecentQuiz['date']): number => {
            if (d && typeof (d as Timestamp).toMillis === 'function') {
              return (d as Timestamp).toMillis();
            }
            if (d instanceof Date) {
              return d.getTime();
            }
            if (typeof d === 'string') {
              return new Date(d).getTime();
            }
            return 0;
          };
          return getTime(b.date) - getTime(a.date);
        });

        recentQuizzes = recentQuizzes.slice(0, 5);

    
        await runInInjectionContext(this.injector, () =>
          updateDoc(userRef, {
            'quizStats.quizzesTaken': increment(statsUpdate.quizzesTaken),
            'quizStats.totalScore': increment(statsUpdate.totalScore),
            'quizStats.timeSpent': increment(statsUpdate.timeSpent),
            recentQuizzes,
          })
        );
        const recentForStreak = recentQuizzes.map(q => ({
          date: q.date instanceof Timestamp ? q.date.toDate(): q.date
        }))

        await this.streakService.updateStreak(recentForStreak);
        
        const userId = this.getCurrentUserId()

        if(!userId) return;

        await this.achievementService.checkAndUnlockAchievements(userId)
        
      } else {
       
        await runInInjectionContext(this.injector, () =>
          setDoc(
            userRef,
            {
              quizStats: {
                quizzesTaken: statsUpdate.quizzesTaken,
                totalScore: statsUpdate.totalScore,
                timeSpent: statsUpdate.timeSpent,
              },
              recentQuizzes: [recentQuiz],
            },
            { merge: true }
          )
        );
      }
    })
  );
}
isEmailTaken(email: string): Observable<boolean> {
  const usersRef = collection(this.firestore, 'users');
  const q = query(usersRef, where('email', '==', email.toLowerCase()));
  return from(getDocs(q)).pipe(map(snapshot => !snapshot.empty));
}

async unlockAchievement(userId: string, achievementId: string) {
  const userRef = doc(this.firestore, 'users', userId);
  await updateDoc(userRef, {
    achievements: arrayUnion({ id: achievementId, unlockedAt: new Date().toISOString() })
  });
}
}
