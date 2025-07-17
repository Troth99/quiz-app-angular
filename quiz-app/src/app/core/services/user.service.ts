import { inject, Injectable, Injector, runInInjectionContext } from "@angular/core";
import { collection, collectionData, doc, docData, Firestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { User } from "../models";


//runInInjectionContext = to be sure that we are fetching the data whithin injection context and not outside, to avoid more errors.

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // private injector = inject(Injector);
    constructor(private firestore: Firestore, private injector: Injector){
    }

    getUser(uid: string): Observable<User> {
        return runInInjectionContext(this.injector, ()=> {
            const userDoc = doc(this.firestore, `users/${uid}`);
            return docData(userDoc) as Observable<User>
        })
    }
    getAllUsers(): Observable<User[]> {
        return runInInjectionContext(this.injector, () => {
            const userRef = collection(this.firestore, 'users');
            return collectionData(userRef, {idField: 'id'}) as Observable<User[]>
        })
    }
}