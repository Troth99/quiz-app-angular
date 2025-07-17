import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-quiz-navigation-component',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, RouterLink],
  templateUrl: './quiz-navigation-component.html',
  styleUrl: './quiz-navigation-component.css'
})
export class QuizNavigationComponent {
private authService = inject(AuthService)

isLoggedIn = this.authService.isLoggedIn

mobileMenuActive = false;

constructor(private router: Router){
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd){
      this.mobileMenuActive = false
    }
  })
}
toggleMobileMenu() {
  this.mobileMenuActive = !this.mobileMenuActive

}

  onSearch() {

  }


}
