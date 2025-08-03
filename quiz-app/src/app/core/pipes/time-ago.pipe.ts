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

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute(s) ago`;
    if (hours < 24) return `${hours} hour(s) ago`;
    if (days < 7) return `${days} day(s) ago`;
    if (weeks < 4) return `${weeks} week(s) ago`;
    if (months < 1) return `${days} day(s) ago`; 

 
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
