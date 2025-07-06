import { Component, inject, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected title = 'quiz-app';
  private app = inject(FirebaseApp)

  ngOnInit(): void {
    console.log('firebase app name:', this.app.name)
  }
}
