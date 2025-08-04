import { Routes } from '@angular/router';

import {
  QuizHomeComponent,
  QuizLoginComponent,
  QuizRegisterComponent,
} from './features';

import { AuthLayout, MainLayout, ProfileLayoutComponent } from './core/layouts';
import { AuthGuard, PageNotFoundComponent } from './core';
import { GuestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: QuizHomeComponent },

      {
        path: 'quiz/categories',
        loadComponent: () =>
          import('./features/quiz/quiz-category/quiz-category').then(
            (c) => c.QuizCategory
          ),
      },
      {
        path: 'quiz/categories/:categoryId/tests',
        loadComponent: () =>
          import(
            './features/quiz/quiz-list-component/quiz-list-component'
          ).then((c) => c.QuizListComponent),
      },

      {
        path: 'quiz/create',
        loadComponent: () =>
          import('./features/quiz-create/quiz-create').then(
            (c) => c.QuizCreate
          ),
        canActivate: [GuestGuard],
      },
      {
        path: 'quiz/play/:categoryName/:id',
        loadComponent: () => 
          import('./features/quiz/quiz-player/quiz-player').then(
            (c) => c.QuizPlayer
          ),
          runGuardsAndResolvers: 'paramsChange'
      },

      { path: 'page-not-found', component: PageNotFoundComponent },

      {
        path: 'profile',
        component: ProfileLayoutComponent,
        canActivate: [GuestGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/profile/profile').then((c) => c.Profile),
          },
          {
            path: 'change-display-name',
            loadComponent: () =>
              import(
                './features/profile/profile-setthings/change-display-name/change-display-name'
              ).then((c) => c.ChangeDisplayName),
          },
          {
            path: 'change-password',
            loadComponent: () =>
              import('./features/auth/change-password/change-password').then(
                (c) => c.changePassword
              ),
          },
          {
            path: 'my-created-quizzes',
            loadComponent: () =>
              import('./features/my-created-quizzes/my-created-quizzes').then(
                (c) => c.MyCreatedQuizzes
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () => 
              import('./features/edit-quiz/edit-quiz').then (
                (c) => c.EditQuiz
              )
          }
        ],
      },
    ],
  },

  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/login/quiz-login-component').then(
            (c) => c.QuizLoginComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/register/quiz-register-component').then(
            (c) => c.QuizRegisterComponent
          ),
        canActivate: [AuthGuard],
      },
    ],
  },

  { path: '**', redirectTo: 'page-not-found' },
];
