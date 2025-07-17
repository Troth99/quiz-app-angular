import { Injectable, signal } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { finalize, from, map, Observable, tap } from 'rxjs';
import { AuthResponseModel } from '../models/user/authResponse.model';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();
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
      tap(async (cred: UserCredential) => {

        const user = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || null,
          photoUrl: cred.user.photoURL || null
        }

        localStorage.setItem('currentLoggedUser', JSON.stringify(user))
        this.currentUserUid.set(user.uid);
        this._isLoggedIn.set(true)

      }),
      map((cred: UserCredential) => ({
        userId: cred.user.uid,
        email: cred.user.email,
      })),
      
      finalize(() => this.loading.set(false))
     
      
   
      );
  }

  register() { }

  logout() {
    localStorage.removeItem('currentLoggedUser');
    this.currentUserUid.set(null);
    this._isLoggedIn.set(false)
  }

  get uid(): string | null {
    return this.currentUserUid();
  }





}
