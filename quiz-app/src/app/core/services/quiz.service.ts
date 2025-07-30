import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { combineLatest, forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Category } from '../models/quizzes/category.model';
import { Quiz } from '../models';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';


@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private firestore: Firestore) {}

  private injector = inject(Injector);

  getTestByCategory(categoryName: string): Observable<Quiz[]> {
    return runInInjectionContext(this.injector, () => {
      const testsRef = collection(
        this.firestore,
        `quizzes/${categoryName}/tests`
      );
      return collectionData(testsRef, { idField: 'id' }) as Observable<Quiz[]>;
    });
  }
  
  getCategories(): Observable<Category[]> {
    return runInInjectionContext(this.injector, () => {
      const categoriesRef = collection(this.firestore, 'quizzes');

      return from(getDocs(categoriesRef)).pipe(
        map((snapshot) =>
          snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.id,
          }))
        )
      );
    });
  }

  createCategory(categoryName: string): Observable<void> {
    return runInInjectionContext(this.injector, () => {
      const categoryDoc = doc(this.firestore, `quizzes/${categoryName}`);
      return from(setDoc(categoryDoc, {}));
    });
  }

  addQuizToCategory(categoryName: string, quizData: Quiz): Observable<string> {
    return runInInjectionContext(this.injector, () => {
      const quizzesRef = collection(
        this.firestore,
        `quizzes/${categoryName}/tests`
      );
      return from(addDoc(quizzesRef, quizData)).pipe(map((ref) => ref.id));
    });
  }

  getMyCreateQuizes(userId: string): Observable<Quiz[]>{
    
  return this.getCategories().pipe(
  switchMap(categories => {
    if (!categories.length) {
      return of([]);  
    }

    const quizzesObservables = categories.map(category => {
      const testsRef = collection(this.firestore, `quizzes/${category.name}/tests`);
      const q = query(testsRef, where('createdBy', '==', userId));
      return collectionData(q, { idField: 'id' }) as Observable<Quiz[]>;
    });

    return forkJoin(quizzesObservables);
  }),
  map(results => results.flat())
);
  }

getQuizzesByUser(userId: string): Observable<Quiz[]> {
  return this.getCategories().pipe(
    switchMap(categories => {
      if (!categories.length) return of([]);

      return runInInjectionContext(this.injector, () => {

        const quizzesObservables = categories.map(category => {
          const testsRef = collection(this.firestore, `quizzes/${category.name}/tests`);
          const q = query(testsRef, where('createdBy', '==', userId));
          return collectionData(q, { idField: 'id' }) as Observable<Quiz[]>;
        });
  
        return combineLatest(quizzesObservables).pipe(
          map(results => results.flat())
        );
      })
    })
  );
}




}
