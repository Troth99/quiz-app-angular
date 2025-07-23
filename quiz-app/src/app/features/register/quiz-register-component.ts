import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quiz-register-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './quiz-register-component.html',
  styleUrls: ['./quiz-register-component.css'],
})
export class QuizRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  serverError: string | null = null;

  passwordVisible = false;
  confirmPasswordVisible = false;

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  get loading() {
    return this.authService.isLoading();
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        displayName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  get displayNameControl() {
    return this.registerForm.get('displayName');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  onRegister() {
    this.submitted = true;
    this.serverError = null;

    if (this.registerForm.invalid) return;

    const { displayName, email, password } = this.registerForm.value;

    this.authService
      .register(email, password, displayName)
      .pipe(finalize(() => {}))
      .subscribe({
        next: () => {
          this.authService.login(email, password).subscribe({
            next: () => this.router.navigate(['/profile']),
            error: (err) => console.error('Login error:', err),
          });
        },
        error: (err) => {
          this.handleRegisterError(err);
          console.error('Registration error:', err);
        },
      });
  }


private handleRegisterError(err: unknown) {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes('auth/email-already-in-use')) {
      this.emailControl?.setErrors({ emailExists: true });
      this.serverError = 'Email is already registered.';
    } else if (msg.includes('auth/weak-password')) {
      this.passwordControl?.setErrors({ weakPassword: true });
      this.serverError = 'Password should be at least 6 characters.';
    } else {
      this.serverError = msg;
    }
  } else {
    this.serverError = 'An unexpected error occurred. Please try again.';
  }
}
}
