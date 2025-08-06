import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as UserActions from './view-profile.actions'
import { UserService } from "../../services";
import { catchError, map, of, switchMap } from "rxjs";



@Injectable()

export class UserEffects {

    private readonly actions$ = inject(Actions);
    private readonly userService = inject(UserService);

    
    loadUser$ = createEffect(() => {
       return this.actions$.pipe(
            ofType(UserActions.loadViewUser),
            switchMap(({ id}) => 
                this.userService.getUser( id).pipe(
                    map(user => UserActions.loadUserSuccess( { user } )),
                    catchError(error => of(UserActions.loadUserFailure({error})))
                )
            )
        )
    })
  
}