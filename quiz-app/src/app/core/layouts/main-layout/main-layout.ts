import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { QuizNavigationComponent } from '../../../shared/header';
import { QuizFooterComponent } from '../../../shared/footer';

@Component({
  selector: 'app-main-layout',
  imports: [QuizNavigationComponent, QuizFooterComponent, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
