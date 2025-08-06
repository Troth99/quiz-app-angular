import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'firestoreDate'
})

export class FirestoreDatePipe implements PipeTransform {
  transform(value: any): Date | null {
    if (!value) return null;
    if (value.toDate && typeof value.toDate === 'function') {
      return value.toDate();
    }
    return value;
  }
}