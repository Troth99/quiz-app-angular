import { Component, inject, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';

import { QuizNavigationComponent } from "./shared/header/quiz-navigation-component/quiz-navigation-component";
import { QuizFooterComponent } from "./shared/footer/quiz-footer-component/quiz-footer-component";
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  QuizNavigationComponent, QuizFooterComponent,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected title = 'quiz-app';

}
