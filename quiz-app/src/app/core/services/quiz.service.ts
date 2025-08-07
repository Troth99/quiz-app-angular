import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { combineLatest, forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Category } from '../models/quizzes/category.model';
import { Comment, Quiz } from '../models';
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
  docData,
  updateDoc,
  orderBy,
} from '@angular/fire/firestore';
import { deleteDoc, increment } from 'firebase/firestore';
import { DocumentReference } from 'firebase/firestore/lite';


@Injectable({ providedIn: 'root' })
export class QuizService {


deleteComment(categoryName: string, quizId: string, commentId: string): Observable<void> {
  return runInInjectionContext(this.injector, () => {
    const commentDocRef = doc(this.firestore, `quizzes/${categoryName}/tests/${quizId}/comments/${commentId}`);
    return from(deleteDoc(commentDocRef));
  })
}
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
getQuizById(categoryName: string, quizId: string): Observable<Quiz | null> {

  return runInInjectionContext(this.injector, () => {
    const quizDoc = doc(this.firestore, `quizzes/${categoryName}/tests/${quizId}`);
    return docData(quizDoc, { idField: 'id' }) as Observable<Quiz | null>;
  })
}

updateQuiz(categoryName: string, quizId: string, quizData: Quiz): Observable<void> {
  return runInInjectionContext(this.injector, () => {
    const quizDoc = doc(this.firestore, `quizzes/${categoryName}/tests/${quizId}`);
    return from(setDoc(quizDoc, quizData, {merge : true}));
  });
}


deleteQuiz(categoryName: string, quizId: string): Observable<void> {
  return runInInjectionContext(this.injector, () => {
     const quizDoc = doc(this.firestore, `quizzes/${categoryName}/tests/${quizId}`);
     return from(deleteDoc(quizDoc))
  })
}

addComment(categoryName: string, quizId: string, comment: string, userId: string, userName: string, userPhotoUrl?: string | null): Observable<DocumentReference> {
  return runInInjectionContext(this.injector, () => {
    const commentsRef = collection(this.firestore, `quizzes/${categoryName}/tests/${quizId}/comments`);
    return from(addDoc(commentsRef, {
      text: comment,
      userId,
      userName,
      userPhotoUrl: userPhotoUrl || undefined || null,
      createdAt: new Date(),
    }));
  });
}

getComments(categoryName: string, quizId: string): Observable<Comment[]>{
  return runInInjectionContext(this.injector, () => {
  const commentsRef = collection(this.firestore, `quizzes/${categoryName}/tests/${quizId}/comments`);
  const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'))
  return collectionData(commentsQuery, {idField: 'id'}) as Observable<Comment[]>
  })
}

getUserQuizStatus(userId: string, categoryName: string, quizId: string): Observable<{ isComplete: boolean }> {
  return runInInjectionContext(this.injector, () => {
    const statusDoc = doc(this.firestore, `users/${userId}/quizStatus/${categoryName}_${quizId}`);
    return docData(statusDoc) as Observable<{ isComplete: boolean }>;
  });
}


likeQuiz(categoryName: string, quizId: string, userId: string): Observable<void> {
  return runInInjectionContext(this.injector, () => {
    const likeDocRef = doc(this.firestore, `quizzes/${categoryName}/tests/${quizId}/likes/${userId}`);
    const quizDocRef = doc(this.firestore, `quizzes/${categoryName}/tests/${quizId}`);

    return from(getDoc(likeDocRef)).pipe(
      switchMap((likeDocSnap ) => {

        if(likeDocSnap.exists()) {
          throw new Error('You already liked this quiz.')
        }

      return from(runInInjectionContext(this.injector, () => 
          setDoc(likeDocRef, { likedAt: new Date() })
        )).pipe(
          switchMap(() => from(runInInjectionContext(this.injector, () =>
            updateDoc(quizDocRef, { likesCount: increment(1) })
          ))),
          map(() => void 0)
        );
      })
    )

  })
}
hasLikedQuiz(categoryName: string, quizId: string, userId: string): Observable<boolean> {
    return runInInjectionContext(this.injector, () => {
      const likeDocRef = doc(this.firestore, `quizzes/${categoryName}/tests/${quizId}/likes/${userId}`);
      return from(getDoc(likeDocRef)).pipe(
        map((snap) => snap.exists())
      );
    });
  }
}
