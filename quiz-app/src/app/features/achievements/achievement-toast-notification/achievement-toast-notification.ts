import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-achievement-toast-notification',
  imports: [],
  templateUrl: './achievement-toast-notification.html',
  styleUrl: './achievement-toast-notification.css'
})
export class AchievementToastNotification {
@Input() achievementName: string = "";
@Input() achievementIcon: string = '';
@Output() closed = new EventEmitter<void>()



closeToast() {
  this.closed.emit()
}
}
