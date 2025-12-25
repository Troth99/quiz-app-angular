import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { QuizFooterComponent, QuizNavigationComponent } from '../../../shared';
import { AchievementToastNotification } from "../../../features/achievements/achievement-toast-notification/achievement-toast-notification";


@Component({
  selector: 'app-main-layout',
  imports: [QuizNavigationComponent, QuizFooterComponent, RouterOutlet, AchievementToastNotification],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  toastVisible = false;
  unlockedAchievementName= '';

    showAchievementToast(name: string) {
    this.unlockedAchievementName = name;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 4000);
  }
}
