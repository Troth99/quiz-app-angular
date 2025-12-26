import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { QuizFooterComponent, QuizNavigationComponent } from '../../../shared';
import { AchievementToastService } from '../../services/achievement-toast.service';
import { AchievementToastNotification } from '../../../features/achievements/achievement-toast-notification/achievement-toast-notification';
import { AuthService, UserService } from '../../services';
import { Achievement, User } from '../../models';
import { AchievementService } from '../../services/achievement.service';


@Component({
  selector: 'app-main-layout',
  imports: [QuizNavigationComponent, QuizFooterComponent, RouterOutlet, AchievementToastNotification],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {
  private toastService = inject(AchievementToastService);
  private userService = inject(UserService); 
  private authService = inject(AuthService);
  private achievementService = inject(AchievementService);

  toastVisible = false;
  unlockedAchievementName= '';
  unlockedAchievementIcon: string = '';
  private unlockedIds: Set<string> = new Set();

  ngOnInit(): void {
    this.toastService.onShow().subscribe(({ achievementName, icon }) => {
      this.showAchievementToast(achievementName, icon);
    });

    this.authService.authState().subscribe(user => {
      if (!user) return;
      const userId = user.uid;
      this.achievementService.getAllAchievements().subscribe((allAchievements: Achievement[]) => {
        this.userService.getUser(userId).subscribe((userData: User) => {
          const userAchievements = userData.achievements || [];
          if (this.unlockedIds.size === 0) {
            userAchievements.forEach(ua => this.unlockedIds.add(ua.id));
          }
          userAchievements.forEach(ua => {
            if (!this.unlockedIds.has(ua.id)) {
              const achievement = allAchievements.find((a: Achievement) => a.id === ua.id);
              this.showAchievementToast(achievement?.name || ua.id, achievement?.icon || '');
              this.unlockedIds.add(ua.id);
            }
          });
        });
      });
    });
  }

  showAchievementToast(name: string, icon: string) {
    this.unlockedAchievementName = name;
    this.unlockedAchievementIcon = icon;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 4000);
  }
}
