import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AchievementService } from '../../core/services/achievement.service';
import { combineLatest, Subscription } from 'rxjs';
import { AchievementUi } from '../../core/models';
import { FormsModule } from '@angular/forms';
import { AchievementFilterPipe } from '../../core/pipes/achievementFilterPipe';
import { AuthService, UserService } from '../../core';
import { Loading } from '../../shared';
import { FirestoreDatePipe } from '../../core/pipes/convertFirebaseTimetampToDate.pipe';
import { UnlockedDatePipe } from '../../core/pipes/unlockedDate.pipe';

@Component({
  selector: 'app-achievements',
  imports: [FormsModule, AchievementFilterPipe, UnlockedDatePipe, Loading],
  templateUrl: './achievements.html',
  styleUrls: ['./achievements.css'],
  standalone: true
})
export class Achievements implements OnInit, OnDestroy {

  private achievementService = inject(AchievementService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  achievements: AchievementUi[] = [];
  filter: 'all' | 'completed' | 'uncompleted' = 'all';
  loading = true;

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    const sub = this.authService.authState().subscribe(user => {
      if (!user) return;

      const achSub = combineLatest([
        this.achievementService.getAllAchievements(),
        this.userService.getUser(user.uid)
      ]).subscribe(([allAchievements, userData]) => {

   
        const achievementsList = allAchievements || [];
        const userAchievements = userData.achievements || [];

        this.achievements = achievementsList.map(a => {

          let iconUrl = a.icon || '';
          if (iconUrl.includes('imgur.com') && !iconUrl.includes('i.imgur.com')) {
            const id = iconUrl.split('/').pop();
            iconUrl = `https://i.imgur.com/${id}.png`;
          }

          return {
            ...a,
            icon: iconUrl,
            unlockedAt: userAchievements.find(ua => ua.id === a.id)?.unlockedAt
          } as AchievementUi;
        }).sort((a, b) => {
          if (a.unlockedAt && !b.unlockedAt) return -1;
          if (!a.unlockedAt && b.unlockedAt) return 1;
          return 0;
        });

  
        this.loading = false;
      });

      this.subscription.add(achSub);
    });

    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
