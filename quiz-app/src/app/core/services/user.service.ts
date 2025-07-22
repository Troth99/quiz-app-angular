import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from, of, switchMap, throwError } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  updateUser(uid: string, arg1: { photoUrl: any; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private firestore: Firestore, private injector: Injector) {}

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


}
