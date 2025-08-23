import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';





@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected title = 'quiz-app';


  constructor(private router: Router){
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        const stored = localStorage.getItem('currentLoggedUser');

        if(stored){
          const parsedUser = JSON.parse(stored);
          parsedUser.lastActive = Date.now();
          localStorage.setItem('currentLoggedUser', JSON.stringify(parsedUser))
        }
      }
    })
  }

}
