import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { environment } from '../enviroments/enviroment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';
import { provideStorage } from '@angular/fire/storage';
import { getStorage } from 'firebase/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MyQuizzesEffects } from './core/store/quiz-store/quiz.effects';
import { myQuizzesReducer } from './core/store/quiz-store/quiz.reducer';
import { userReducer } from './core/store/view-profile-store/view-profile.reducer';
import { UserEffects } from './core/store/view-profile-store/view-profile.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStorage(() => getStorage()),
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    provideStore({
      myQuizzes: myQuizzesReducer,
      viewUser: userReducer,
    }),
    
    provideEffects(MyQuizzesEffects, UserEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
