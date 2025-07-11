import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-quiz-navigation-component',
  imports: [MatButtonModule, MatMenuModule],
  templateUrl: './quiz-navigation-component.html',
  styleUrl: './quiz-navigation-component.css'
})
export class QuizNavigationComponent {
isLoggedIn = false;
mobileMenuActive = false;

toggleMobileMenu() {
  this.mobileMenuActive = !this.mobileMenuActive

}

  onSearch() {

  }
  logout(){

  }
}
