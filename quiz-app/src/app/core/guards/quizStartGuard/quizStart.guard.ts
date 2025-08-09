import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";


@Injectable({
    providedIn: 'root'
})
export class QuizStartGuard implements CanActivate {
constructor(private router: Router){}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const confirmed = window.confirm('Are you sure you want to start the quiz?');

    if(!confirmed) {
        const categoryName = route.params['categoryName'];
        const quizId = route.params['quizId'];
        this.router.navigate(['/quiz/play', categoryName, quizId]);
        return false
    }
    return true
}
}