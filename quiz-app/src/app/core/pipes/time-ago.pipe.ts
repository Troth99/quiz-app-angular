import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | string | number | Timestamp | null | undefined): string {
    let date: Date;

    if (!value) return '';

    if (value instanceof Timestamp) {
      date = value.toDate();
    } else {
      date = new Date(value);
    }

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(seconds)) return '';

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minute(s) ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour(s) ago`;

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
