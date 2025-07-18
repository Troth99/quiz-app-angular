import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

export interface ToastOptions {
    duration? :number;
    verticalPosition?: MatSnackBarVerticalPosition;
    horizontalPosition? : MatSnackBarHorizontalPosition;
}