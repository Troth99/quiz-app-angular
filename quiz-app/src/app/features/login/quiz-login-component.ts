import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services';
import { ToastService } from '../../core';
import { AuthResponseModel } from '../../core/models/user/authResponse.model';
import {
  ErrorMessage,
  FirebaseLoginErrorHandler,
  QuizLoginValidators,
} from '../../shared';
import { QuizLoginForm } from '../auth/forms/login.form';

@Component({
  selector: 'app-quiz-login-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ErrorMessage,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './quiz-login-component.html',
  styleUrls: ['./quiz-login-component.css'],
})
export class QuizLoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private formGroup = inject(QuizLoginForm);
  private subscription = new Subscription();
  public validators = inject(QuizLoginValidators);

  redirectUrl: string | null = null;
  loading = this.authService.isLoading;
  submitted = false;
  emailFocused = false;
  passwordVisible = false;
  loginError: string | null = null;

  ngOnInit(): void {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');

    this.validators.setState(this.submitted, this.emailFocused);

    const routeSub = this.route.queryParamMap.subscribe((params) => {
      const message = params.get('message');
      if (message === 'login-required') {
        this.toast.show('Please log in to access the profile.');
      }
    });

     this.formGroup.reset()
    this.subscription.add(routeSub);
  }

  onLogin(): void {
    this.submitted = true;
    this.loginError = null;

    if (this.formGroup.invalid) return;

    const { email, password } = this.formGroup.value;

    const loginSub = this.authService.login(email!, password!).subscribe({
      next: (_res: AuthResponseModel) => {
        this.formGroup.reset()
        this.router.navigateByUrl(this.redirectUrl || '');
      },
      error: (err: unknown) => {
        const firebaseError = err as { code?: string; message?: string };
        this.loginError = FirebaseLoginErrorHandler.getMessage(
          firebaseError.code,
          firebaseError.message
        );
      },
    });

    this.subscription.add(loginSub);
  }

  get passwordControl() {
    return this.formGroup.password;
  }
  get emailControl() {
    return this.formGroup.email;
  }

  get loginForm() {
    return this.formGroup.form;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
