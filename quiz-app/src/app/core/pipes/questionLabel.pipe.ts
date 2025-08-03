import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'questionLabel',
    standalone: true
})

export class QuestionLabelPipe implements PipeTransform {
    transform(index: number): string {
        return `Question: ${index + 1}`
    }
}