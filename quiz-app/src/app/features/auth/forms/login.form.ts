import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class QuizLoginForm {
 
  form: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;


  constructor() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }
  reset (){
    this.form.reset()
  }
  get email(): FormControl<string> {
    return this.form.get('email') as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.form.get('password') as FormControl<string>;
  }

  get value(): { email: string; password: string } {
    return this.form.value as { email: string; password: string };
  }

  get invalid(): boolean {
    return this.form.invalid;
  }
}
