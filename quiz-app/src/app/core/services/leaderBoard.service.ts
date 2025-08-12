import { inject, Injectable, Injector, runInInjectionContext } from "@angular/core";
import { collection, Firestore, getDocs, limit, orderBy, query, where } from "@angular/fire/firestore";
import { from, map, Observable } from "rxjs";
import { leaderboardEntry } from "../models";

@Injectable({
    providedIn: 'root'
})

export class LeaderboardService {
    private injector = inject(Injector)
    private firestore = inject(Firestore);


 getTopUsers(pageSize = 20): Observable<leaderboardEntry[]> {
  return runInInjectionContext(this.injector, () => {
    const userRef = collection(this.firestore, 'users');
    const q = query(
      userRef,
      where('quizStats.totalScore', '>', 0),
      orderBy('quizStats.totalScore', 'desc'),
      limit(pageSize)
    );

    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => {
          const data = doc.data() as leaderboardEntry;
          return { id: doc.id, ...data };
        })
      )
    );
  });
}
}