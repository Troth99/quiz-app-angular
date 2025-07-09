import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-navigation-component',
  imports: [],
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
