import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'quizStatus',
    standalone: true,
})

export class QuizStatusPipe implements PipeTransform {

    transform(completed: boolean, score: number, max : number): string {

        if(!completed){
            return 'In progress'
        }
        const percent = (score / max) * 100;

        if(percent >= 80){
            return 'Passed'
        }
        return 'Failed'
        
    }
}