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
import { doc, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
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
  get uid(): string | null {
    return this.currentUserUid();
  }

}
