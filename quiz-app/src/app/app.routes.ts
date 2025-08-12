import { Routes } from '@angular/router';

import {
  QuizHomeComponent,
  QuizLoginComponent,
  QuizRegisterComponent,
} from './features';

import { AuthLayout, MainLayout, ProfileLayoutComponent } from './core/layouts';
import { AuthGuard, PageNotFoundComponent } from './core';
import { GuestGuard, QuizActiveGuard, QuizStartGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: QuizHomeComponent, canActivate: [QuizActiveGuard] },

      {
        path: 'quiz/categories',
        loadComponent: () =>
          import('./features/quiz/quiz-category/quiz-category').then(
            (c) => c.QuizCategory
          ),
        canActivate: [QuizActiveGuard]
      },
      {
        path: 'quiz/categories/:categoryId/tests',
        loadComponent: () =>
          import(
            './features/quiz/quiz-list-component/quiz-list-component'
          ).then((c) => c.QuizListComponent),
        canActivate: [QuizActiveGuard]
      },

      {
        path: 'quiz/create',
        loadComponent: () =>
          import('./features/quiz-create/quiz-create').then(
            (c) => c.QuizCreate
          ),
        canActivate: [GuestGuard, QuizActiveGuard],
      },
      {
        path: 'quiz/play/:categoryName/:id',
        loadComponent: () =>
          import('./features/quiz/quiz-player/quiz-player').then(
            (c) => c.QuizPlayer
          ),
        runGuardsAndResolvers: 'paramsChange',
        canActivate: [QuizActiveGuard]
      },

      {
        path: 'user/:id',
        loadComponent: () =>
          import('./features/profile-view/profile-view').then(
            (c) => c.ProfileView
          ),
        canActivate: [QuizActiveGuard]
      },
      {
        path: 'quiz/:categoryName/:quizId/report-bug',
        loadComponent: () =>
          import('./features/quiz/quiz-bug-report/quiz-bug-report').then(
            (c) => c.QuizBugReport
          ),
        canActivate: [GuestGuard, QuizActiveGuard],
      },

      {
        path: 'quiz-resolve/:categoryName/:quizId',
        loadComponent: () => 
          import('./features/quiz/quiz-resolver/quiz-resolver').then(
            (c) => c.QuizResolver
          ),
          canActivate: [QuizStartGuard]
      },

      {
        path: 'leaderboard',
        loadComponent: () => 
          import('./features/leaderboard/leaderboard').then(
            (c) => c.Leaderboard
          ),
          canActivate: [QuizActiveGuard]
      },


      { path: 'page-not-found', component: PageNotFoundComponent, canActivate: [QuizActiveGuard] },

      {
        path: 'profile',
        component: ProfileLayoutComponent,
        canActivate: [GuestGuard, QuizActiveGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/profile/profile').then((c) => c.Profile),
            canActivate: [QuizActiveGuard]
          },
          {
            path: 'change-display-name',
            loadComponent: () =>
              import(
                './features/profile/profile-setthings/change-display-name/change-display-name'
              ).then((c) => c.ChangeDisplayName),
            canActivate: [QuizActiveGuard]
          },
          {
            path: 'change-password',
            loadComponent: () =>
              import('./features/auth/change-password/change-password').then(
                (c) => c.changePassword
              ),
            canActivate: [QuizActiveGuard]
          },
          {
            path: 'my-created-quizzes',
            loadComponent: () =>
              import('./features/my-created-quizzes/my-created-quizzes').then(
                (c) => c.MyCreatedQuizzes
              ),
            canActivate: [QuizActiveGuard]
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/edit-quiz/edit-quiz').then((c) => c.EditQuiz),
            canActivate: [QuizActiveGuard]
          },
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
