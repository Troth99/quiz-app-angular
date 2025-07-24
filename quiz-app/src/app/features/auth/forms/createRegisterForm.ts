import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordsMatchValidator } from '../../../shared';


@Injectable({ providedIn: 'root' })
export class RegisterFormService {
  constructor(private fb: FormBuilder) {}

  createForm(): FormGroup {
    return this.fb.group(
      {
        displayName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: passwordsMatchValidator,
      }
    );
  }

  getControls(form: FormGroup) {
    return {
      displayName: form.get('displayName')!,
      email: form.get('email')!,
      password: form.get('password')!,
      confirmPassword: form.get('confirmPassword')!,
    };
  }
}
