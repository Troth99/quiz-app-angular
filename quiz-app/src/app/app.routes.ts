import { Routes } from '@angular/router';
import { QuizHomeComponent } from './features/home/quiz-home-component/quiz-home-component';
import { QuizLoginComponent } from './features';


export const routes: Routes = [
    {path: '', component: QuizHomeComponent},
    {path: 'login', component: QuizLoginComponent}
];
