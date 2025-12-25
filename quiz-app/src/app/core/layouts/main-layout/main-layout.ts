import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { QuizFooterComponent, QuizNavigationComponent } from '../../../shared';
import { AchievementToastService } from '../../services/achievement-toast.service';


@Component({
  selector: 'app-main-layout',
  imports: [QuizNavigationComponent, QuizFooterComponent, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {
  private toastService = inject(AchievementToastService);

  toastVisible = false;
  unlockedAchievementName= '';
  unlockedAchievementIcon: string = '';

ngOnInit(): void {
  this.unlockedAchievementName = 'Test Achievement';
  this.unlockedAchievementIcon = 'https://i.imgur.com/test.png'; // Може да сложиш и локален път
  this.toastVisible = true;
  this.toastService.onShow().subscribe(({ achievementName, icon }) => {
    this.showAchievementToast(achievementName, icon);
  });
}

    showAchievementToast(name: string, icon: string) {
    this.unlockedAchievementName = name;
    this.unlockedAchievementIcon = icon
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 4000);
  }
}
