import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'

})
export class QuizStateService {
    private activeQuiz = false;

    setActive( active: boolean){
        this.activeQuiz = active
    }

    isActive(): boolean {
        return this.activeQuiz
    }
}