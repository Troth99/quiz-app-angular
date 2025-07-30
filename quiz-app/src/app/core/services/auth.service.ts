import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import {
  signInWithEmailAndPassword,
  UserCredential,
  updateProfile,
  EmailAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  from,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
  finalize,
} from 'rxjs';
import { AuthResponseModel } from '../models/user/authResponse.model';
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
} from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private injector = inject(Injector);

  private currentUserUid = signal<string | null>(null);
  private loading = signal(false);
  private _isLoggedIn = signal(false);

  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly isLoading = this.loading.asReadonly();

  constructor() {
    const currentSavedUser = localStorage.getItem('currentLoggedUser');
    if (currentSavedUser) {
      const parsedUser = JSON.parse(currentSavedUser);
      this.currentUserUid.set(parsedUser.uid);
      this._isLoggedIn.set(true);
    }
  }

authState(): Observable<User | null> {
  return runInInjectionContext(this.injector, () => {
    return new Observable<User | null>((subscriber) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        subscriber.next(user);
      });
      return { unsubscribe };
    });
  });
}

  register(
    email: string,
    password: string,
    displayName: string
  ): Observable<UserCredential> {
    this.loading.set(true);

  
    return runInInjectionContext(this.injector, () =>
      from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
        switchMap((userCredential) => {
          const user = userCredential.user;
          if (!user) return throwError(() => new Error('Registration failed'));

          return runInInjectionContext(this.injector, () =>
            from(updateProfile(user, { displayName }))
          ).pipe(
            switchMap(() => {
              const userDoc = {
                displayName,
                createdQuizzies: [],
                email: user.email || '',
                photoUrl: '',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                quizStats: {
                  lastQuizDate: null,
                  quizzesTaken: '0',
                  timeSpent: '0',
                  totalScore: '0',
                },
                lastDisplayNameChange: null,
                recentQuizzes: [],
              };

              return runInInjectionContext(this.injector, () =>
                from(setDoc(doc(this.firestore, 'users', user.uid), userDoc))
              ).pipe(map(() => userCredential));
            })
          );
        }),
        tap((userCredential) => {
          this.currentUserUid.set(userCredential.user.uid);
          this._isLoggedIn.set(true);

          const user = userCredential.user;
          localStorage.setItem(
            'currentLoggedUser',
            JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoUrl: user.photoURL,
              lastLogin: new Date().toISOString(),
            })
          );
        }),
        finalize(() => this.loading.set(false))
      )
    );
  }

  login(email: string, password: string): Observable<AuthResponseModel> {
    this.loading.set(true);

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((cred: UserCredential) => {
        const uid = cred.user.uid;

        const user = {
          uid,
          email: cred.user.email,
          displayName: cred.user.displayName || null,
          photoUrl: cred.user.photoURL || null,
          lastLogin: new Date().toISOString(),
        };

        localStorage.setItem('currentLoggedUser', JSON.stringify(user));
        this.currentUserUid.set(uid);
        this._isLoggedIn.set(true);

        return from(this.userService.updateLogin(uid)).pipe(
          map(
            (): AuthResponseModel => ({
              userId: uid,
              email: cred.user.email!,
            })
          )
        );
      }),
      finalize(() => this.loading.set(false))
    );
  }

  async logout() {
    await this.auth.signOut();
    localStorage.removeItem('currentLoggedUser');
    localStorage.removeItem('user');
    this.currentUserUid.set(null);
    this._isLoggedIn.set(false);
  }

  updateDisplayName(newName: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) return throwError(() => new Error('User not logged in'));

    this.loading.set(true);
    const uid = user.uid;

    const userDoc = runInInjectionContext(this.injector, () => {
      return doc(this.firestore, 'users', uid);
    });

    const updateProfile$ = runInInjectionContext(this.injector, () => {
      return from(updateProfile(user, { displayName: newName }));
    });

    return updateProfile$.pipe(
      switchMap(() =>
        runInInjectionContext(this.injector, () =>
          from(
            updateDoc(userDoc, {
              displayName: newName,
              lastDisplayNameChange: serverTimestamp(),
            })
          )
        )
      ),
      tap(() => {
        const stored = localStorage.getItem('currentLoggedUser');
        if (stored) {
          const userData = JSON.parse(stored);
          userData.displayName = newName;
          localStorage.setItem('currentLoggedUser', JSON.stringify(userData));
        }
      }),
      finalize(() => this.loading.set(false))
    );
  }

 async deleteUser(password: string) {
  const user = this.auth.currentUser;
  if (!user || !user.email) throw new Error('No user logged in');

  const credential = EmailAuthProvider.credential(user.email, password);


  await runInInjectionContext(this.injector, () => reauthenticateWithCredential(user, credential));


  await runInInjectionContext(this.injector, async () => {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    await deleteDoc(userDocRef);
    await user.delete();
  });
}

  get uid(): string | null {
    return this.currentUserUid();
  }
}
