import { Pipe, PipeTransform } from '@angular/core';
import { AchievementUi } from '../../core/models';

@Pipe({
  name: 'achievementFilter',
  standalone: true
})
export class AchievementFilterPipe implements PipeTransform {
  transform(
    achievements: AchievementUi[],
    filter: 'all' | 'completed' | 'uncompleted'
  ): AchievementUi[] {
    if (!achievements) return [];

    switch (filter) {
      case 'completed':
        return achievements.filter(a => !!a.unlockedAt);
      case 'uncompleted':
        return achievements.filter(a => !a.unlockedAt);
      default:
        return achievements;
    }
  }
}
