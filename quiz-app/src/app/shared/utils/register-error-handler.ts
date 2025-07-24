import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class RegisterErrorHandler {
  reigsterHandlerErrors(err: unknown, form: FormGroup): string {
    if (err instanceof Error) {
      const msg = err.message;

      if (msg.includes('auth/email-already-in-use')) {
        form.get('email')?.setErrors({ emailExists: true });
        return 'Email is already registered.';
      }

      if (msg.includes('auth/weak-password')) {
        form.get('password')?.setErrors({ weakPassword: true });
        return 'Password should be at least 6 characters.';
      }

      return msg;
    }

    return 'An unexpected error occurred. Please try again.';
  }
}