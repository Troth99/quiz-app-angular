import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";



@Injectable({
    providedIn: 'root'
})

export class ReportBugForm {
    
    constructor(private fb: FormBuilder){}

   createForm(testId: string = '', disabled = false): FormGroup {
    return this.fb.group({
        testId: [{ value: testId, disabled }],
        title: [{ value: '', disabled }, Validators.required],
        description: [{ value: '', disabled }, Validators.required]
    });
}


    getControls(form: FormGroup) {
        return {
            title: form.get('title'),
            description: form.get('description')
        }
    }
}