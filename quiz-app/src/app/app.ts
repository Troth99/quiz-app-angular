import { Component, inject, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { RouterOutlet } from '@angular/router';
import { QuizNavigationComponent } from "./shared/header/quiz-navigation-component/quiz-navigation-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, QuizNavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected title = 'quiz-app';

}
