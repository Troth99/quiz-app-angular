import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'unlockedDate',
  standalone: true
})
export class UnlockedDatePipe implements PipeTransform {
  transform(value: any): string | null {
    if (!value) return null;

    let date: Date;

    if (value.toDate && typeof value.toDate === 'function') {
      date = value.toDate();
    } else {
      date = new Date(value);
    }

    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
