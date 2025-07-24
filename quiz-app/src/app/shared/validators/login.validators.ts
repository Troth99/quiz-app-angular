import { Injectable } from '@angular/core';
import { QuizLoginForm } from "../../features/auth/forms/login.form";

@Injectable({
  providedIn: 'root',
})
export class QuizLoginValidators {
  submitted = false;
  emailFocused = false;

  constructor(private form: QuizLoginForm) {}

  setState(submitted: boolean, emailFocused: boolean): void {
    this.submitted = submitted;
    this.emailFocused = emailFocused;
  }

  get emailRequired(): boolean {
    return (
      !!this.form.email?.errors?.['required'] &&
      (this.form.email.touched || this.submitted)
    );
  }

  get emailInvalid(): boolean {
    return (
      !!this.form.email?.errors?.['email'] &&
      (this.form.email.touched || this.submitted) &&
      !this.emailFocused
    );
  }

  get passwordRequired(): boolean {
    return (
      !!this.form.password?.errors?.['required'] &&
      (this.form.password.touched || this.submitted)
    );
  }
}
