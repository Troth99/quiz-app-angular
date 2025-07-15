import { Routes } from '@angular/router';

import {
    QuizControlerComponent,
  QuizHomeComponent,
  QuizLoginComponent,
  QuizRegisterComponent,
} from './features';

import { AuthLayout, MainLayout } from './core/layouts';
import { PageNotFoundComponent } from './core';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
        { path: '', component: QuizHomeComponent },
        {path: "quiz/categories", component: QuizControlerComponent},
        {path: 'page-not-found', component: PageNotFoundComponent},

    ],
    
  },

  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: QuizLoginComponent,
      },
      {
        path: 'register',
        component: QuizRegisterComponent,
      },
    ],
  },

    {path: '**', redirectTo: 'page-not-found'}
];
