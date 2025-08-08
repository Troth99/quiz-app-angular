import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuizTimerService {
  private startTimestamp: number | null = null;
  private readonly durationMs = 20 * 60 * 1000;

  start() {
    if (!this.startTimestamp) {
      const stored = localStorage.getItem('quizStart');
      if (stored) {
        this.startTimestamp = +stored;
      } else {
        this.startTimestamp = Date.now();
        localStorage.setItem('quizStart', this.startTimestamp.toString());
      }
    }
  }
  getTimeLeft(): number {
    if (!this.startTimestamp) {
      const stored = localStorage.getItem('quizStart');

      if (stored) {
        this.startTimestamp = +stored;
      } else {
        return this.durationMs;
      }
    }
    const elapsed = Date.now() - this.startTimestamp;
    return Math.max(this.durationMs - elapsed, 0);
  }


 stop() {
    this.startTimestamp = null; 
    localStorage.removeItem('quizStart');

  }
}
