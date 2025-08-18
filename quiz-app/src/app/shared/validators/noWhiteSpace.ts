import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class noWhiteSpaceValidator {

    static noWhiteSpace(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const isWhiteSpace = (control.value || '').trim().length === 0;
            return isWhiteSpace ? {required: true} : null;
        }
    }
   
}