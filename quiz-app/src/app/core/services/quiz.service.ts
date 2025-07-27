import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { from, map, Observable } from 'rxjs';
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
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private firestore: Firestore) {}

  private injector = inject(Injector);

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
    })

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
}
