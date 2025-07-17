import { Routes } from '@angular/router';

import {
    QuizControlerComponent,
  QuizHomeComponent,
  QuizLoginComponent,
  QuizRegisterComponent,
} from './features';

import { AuthLayout, MainLayout } from './core/layouts';
import { AuthGuard, PageNotFoundComponent } from './core';
import { GuestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
        { path: '', component: QuizHomeComponent },
        {path: "quiz/categories", 
         loadComponent: () => import('./features/quiz/quiz-controler-component/quiz-controler-component').then(c => c.QuizControlerComponent)},
        {path: 'page-not-found', component: PageNotFoundComponent},
        {path: 'profile',
          loadComponent: () => import('./features/profile/profile').then(c => c.Profile ),
          canActivate: [GuestGuard]
        }

    ],
    
  },

  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/login/quiz-login-component').then(c => c.QuizLoginComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'register',
       loadComponent: () => import('./features/register/quiz-register-component').then(c => c.QuizRegisterComponent)
      },
    ],
  },

    {path: '**', redirectTo: 'page-not-found'}
];
