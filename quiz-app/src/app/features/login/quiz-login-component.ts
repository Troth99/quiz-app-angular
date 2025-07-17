import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { AuthResponseModel } from '../../core/models/user/authResponse.model';
import { CommonModule } from '@angular/common';
import { ErrorMessage } from '../../shared';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-quiz-login-component',
  imports: [ReactiveFormsModule, CommonModule, ErrorMessage, RouterLink],
  templateUrl: './quiz-login-component.html',
  styleUrl: './quiz-login-component.css',
})

export class QuizLoginComponent implements OnDestroy {

  private authService = inject(AuthService);
  private router = inject(Router)

  loading = this.authService.isLoading
  submitted = false;
  emailFocused = false;
  passwordVisible = false;

 

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  loginError: string | null = null;
  private subscription = new Subscription();

  onLogin(): void {
    this.submitted = true;
    this.loginError = null;

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.subscription.add(
      this.authService.login(email!, password!).subscribe({
        next: (_res: AuthResponseModel) => {
            this.router.navigate([''])
        },
        error: (err: unknown) => {
          const firebaseError = err as { code?: string; message?: string };
          switch (firebaseError.code) {
            case 'auth/invalid-email':
              this.loginError = 'The email address is invalid.';
              break;
            case 'auth/user-disabled':
              this.loginError = 'This user account has been disabled.';
              break;
            case 'auth/user-not-found':
              this.loginError = 'User not registered.';
              break;
            case 'auth/wrong-password':
              this.loginError = 'Incorrect password.';
              break;
            case 'auth/invalid-credential':
              this.loginError = 'Invalid login credentials.';
              break;
            default:
              this.loginError =
                firebaseError.message || 'An unknown error occurred.';
          }
        },
      })
    );
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  get emailRequired(): boolean {
    return !!this.emailControl?.errors?.['required'] &&
      (this.emailControl.touched || this.submitted);
  }

  get emailInvalid(): boolean {
    return !!this.emailControl?.errors?.['email'] &&
      (this.emailControl.touched || this.submitted) &&
      !this.emailFocused; 
  }

  get passwordRequired(): boolean {
    return !!this.passwordControl?.errors?.['required'] &&
      (this.passwordControl.touched || this.submitted);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}