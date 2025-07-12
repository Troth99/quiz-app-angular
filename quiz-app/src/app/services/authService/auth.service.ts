import { Injectable } from "@angular/core";
import { getAuth, onAuthStateChanged } from "@angular/fire/auth";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserUid$ = new BehaviorSubject<string | null>(null)


    constructor(){
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user){
                this.currentUserUid$.next(user.uid)
            }else {
                this.currentUserUid$.next(null)
            }
        })
    }

    get uid(): string | null {
        return this.currentUserUid$.value
    }
    
   
    get uid$(): Observable<string| null> {
        return this.currentUserUid$.asObservable()
    }

}