import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'ScoreColor',
    standalone: true
})

export class ScoreColorPipe implements PipeTransform {

    transform(score: number, max: number): string {
        const percent = (score / max) * 100;

        if(percent >= 80) {
            return 'green'
        }

        if( percent >= 50){
            return 'orange'
        }
        return 'red'
    }
}