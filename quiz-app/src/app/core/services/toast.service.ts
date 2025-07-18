import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastOptions } from "../models/toast/toast.model";

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private snackBar: MatSnackBar){}

    show(message: string, action: string = 'Close', options : ToastOptions = {}){
        this.snackBar.open(message, action, {
            duration: options.duration ?? 3000,
            verticalPosition: options.verticalPosition ?? 'top',
            horizontalPosition: options.horizontalPosition ?? 'center'
        })
    }
}