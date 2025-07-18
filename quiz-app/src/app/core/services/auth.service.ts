import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { finalize, from, map, Observable, switchMap, tap } from 'rxjs';
import { AuthResponseModel } from '../models/user/authResponse.model';
import { doc } from 'firebase/firestore';
import { Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(Injector)

  private userService = inject(UserService)
  private currentUserUid = signal<string | null>(null);
  private loading = signal(false);

  readonly _isLoggedIn = signal(false)

  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly isLoading = this.loading.asReadonly()


 
  constructor(){
    const currentSavedUser = localStorage.getItem('currentLoggedUser');
    if(currentSavedUser) {
      const parsedUser = JSON.parse(currentSavedUser);
      this.currentUserUid.set(parsedUser.uid)
      this._isLoggedIn.set(true)
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
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('currentLoggedUser', JSON.stringify(user));
      this.currentUserUid.set(user.uid);
      this._isLoggedIn.set(true);

      
    return from(this.userService.updateLogin(uid)).pipe(
      map((): AuthResponseModel => ({
        userId: cred.user.uid,
        email: cred.user.email!
      }))
    )
    }),
    finalize(() => this.loading.set(false))
  );
}
  register() { }

  logout() {
    localStorage.removeItem('currentLoggedUser');
    localStorage.removeItem('user')
    this.currentUserUid.set(null);
    this._isLoggedIn.set(false)
  }

  get uid(): string | null {
    return this.currentUserUid();
  }





}
