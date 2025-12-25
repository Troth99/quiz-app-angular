import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AchievementToastService {
  private achievementSubject = new Subject<{
    achievementName: string;
    icon: string;
  }>();

  show(achievementName: string, icon: string) {
    this.achievementSubject.next({ achievementName, icon });
  }

  onShow(): Observable<{ achievementName: string; icon: string }> {
    return this.achievementSubject.asObservable();
  }
}
