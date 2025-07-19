import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { QuizFooterComponent, QuizNavigationComponent } from '../../../shared';


@Component({
  selector: 'app-main-layout',
  imports: [QuizNavigationComponent, QuizFooterComponent, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
