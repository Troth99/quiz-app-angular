import { createAction, props } from "@ngrx/store";
import { User } from "../../models";



export const loadViewUser = createAction(
    '[User Page] Load User',
    props<{id: string}>()
)


export const loadUserSuccess = createAction(
  '[User API] Load User Success',
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  '[User API] Load User Failure',
  props<{ error: any }>()
);