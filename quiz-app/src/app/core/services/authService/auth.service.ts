import { Injectable } from '@angular/core';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { BehaviorSubject, from, map, Observable, tap } from 'rxjs';
import { AuthResponseModel } from '../../models/user/authResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();
  private currentUserUid$ = new BehaviorSubject<string | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserUid$.next(user.uid);
        localStorage.setItem(
          'user',
          JSON.stringify({
            uid: user.uid,
            email: user.email,
          })
        );
      } else {
        this.currentUserUid$.next(null);
        localStorage.removeItem('user');
      }
    });
  }

  login(email: string, password: string): Observable<AuthResponseModel> {
    this.loading$.next(true);

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap((cred: UserCredential) => {
        localStorage.setItem(
          'user',
          JSON.stringify({
            uid: cred.user.uid,
            email: cred.user.email,
          },
        ),
          
        );
        this.currentUserUid$.next(cred.user.uid);
      }),
      map((cred: UserCredential) => ({
        userId: cred.user.uid,
        email: cred.user.email,
      })),
     tap({
  next: () => this.loading$.next(false),
  error: (err) => {
    console.log('Firebase login error:', err.code, err.message);
    this.loading$.next(false);
  }
})
        
      
    );
  }

  get uid(): string | null {
    return this.currentUserUid$.value;
  }

  get uid$(): Observable<string | null> {
    return this.currentUserUid$.asObservable();
  }

  get isLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('user')
  }
}
