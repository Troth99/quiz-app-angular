import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { QuizStateService } from "../../services/quizState.service";

@Injectable({
    providedIn: 'root'
})
export class QuizActiveGuard implements CanActivate {

    constructor(private quizState: QuizStateService) {}

    canActivate(): boolean {
        if (this.quizState.isActive()) {
            alert('You need to submit the current quiz in order to leave this page.');
            return false; 
        }
        return true;
    }
}