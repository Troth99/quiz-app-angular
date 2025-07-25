import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Category } from '../models/quizzes/category.model';
import { Quiz } from '../models';
import { Firestore, collection, collectionData, doc, setDoc, addDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private firestore: Firestore) {}

  private injector = inject(Injector);

  getCategories(): Observable<Category[]> {
    const categoriesRef = collection(this.firestore, 'quizzes');
    // Взимаме документите (категориите) от 'quizzes' колекцията
    return collectionData(categoriesRef, { idField: 'id' }) as Observable<Category[]>;
  }

  createCategory(categoryName: string): Observable<void> {
    const categoryDoc = doc(this.firestore, `quizzes/${categoryName}`);
    // Създаваме празен документ с името на категорията в 'quizzes' колекцията
    return from(setDoc(categoryDoc, {}));
  }

  addQuizToCategory(categoryName: string, quizData: Quiz): Observable<string> {
    return runInInjectionContext(this.injector, () => {
      const quizzesRef = collection(this.firestore, `quizzes/${categoryName}/tests`);
      return from(addDoc(quizzesRef, quizData)).pipe(map(ref => ref.id));
    });
  }
}
