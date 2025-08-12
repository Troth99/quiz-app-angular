import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService, UserService } from '../../core';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RegisterFormService } from '../auth/forms/createRegisterForm';
import { RegisterErrorHandler } from '../../shared';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-quiz-register-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './quiz-register-component.html',
  styleUrls: ['./quiz-register-component.css'],
})
export class QuizRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  serverError: string | null = null;
  passwordVisible = false;
  confirmPasswordVisible = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private formService = inject(RegisterFormService);
  private errorHandler = inject(RegisterErrorHandler);
  private userService = inject(UserService);

  loading = false;

  ngOnInit(): void {
    this.registerForm = this.formService.createForm();

    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      const emailControl = this.registerForm.get('email');
      if (emailControl?.hasError('emailExists')) {
        emailControl.setErrors(null);
      }
      this.serverError = null;
    });
  }

  get form() {
    return this.formService.getControls(this.registerForm);
  }

  onRegister() {
    this.submitted = true;
    this.serverError = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { displayName, email, password } = this.registerForm.value;

    this.userService.isDisplayNameTaken(displayName).pipe(
      switchMap(isTakenDisplayName => {
        if (isTakenDisplayName) {
          this.serverError = 'Display name is already taken';
          const control = this.registerForm.get('displayName');
          if (control) {
            control.setErrors({ taken: true });
            control.markAsTouched();
            control.markAsDirty();
          }
          this.loading = false;
          return EMPTY;
        }
        return this.userService.isEmailTaken(email);
      }),
      switchMap(isTakenEmail => {
        if (isTakenEmail) {
          this.serverError = 'Email is already registered.';
          const control = this.registerForm.get('email');
          if (control) {
            control.setErrors({ emailExists: true });
            control.markAsTouched();
            control.markAsDirty();
          }
          this.loading = false;
          return EMPTY;
        }
        return this.authService.register(email, password, displayName);
      }),
    ).subscribe({
      next: () => {
        this.authService.login(email, password).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/profile']);
          },
          error: err => {
            this.loading = false;
            console.error('Login error:', err);
          }
        });
      },
      error: err => {
        this.serverError = this.errorHandler.reigsterHandlerErrors(err, this.registerForm);

        const emailControl = this.registerForm.get('email');
        if (emailControl?.hasError('emailExists')) {
          emailControl.markAsTouched();
          emailControl.markAsDirty();
        }

        this.submitted = false;
        this.loading = false;
      }
    });
  }
}
