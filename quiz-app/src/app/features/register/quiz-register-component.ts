import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService, UserService } from '../../core';
import { Router, RouterLink } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';
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

  private userSerive = inject(UserService)

  get loading() {
    return this.authService.isLoading();
  }

  ngOnInit(): void {
    this.registerForm = this.formService.createForm();
  }

  get form() {
    return this.formService.getControls(this.registerForm);
  }

onRegister() {
  this.submitted = true;
  this.serverError = null;

  if (this.registerForm.invalid) return;

  const { displayName, email, password } = this.registerForm.value;

  this.userSerive.isDisplayNameTaken(displayName).pipe(
    switchMap(isTaken => {
      if (isTaken) {
        this.serverError = 'Display name is already taken';
        const control = this.registerForm.get('displayName');
        if (control) {
          control.setErrors({ taken: true });
          control.markAsTouched();
          control.markAsDirty();
        }
        this.submitted = false;
        return EMPTY;
      }
      return this.authService.register(email, password, displayName);
    }),
    finalize(() => {
      this.submitted = false;
    })
  ).subscribe({
    next: () => {
      this.authService.login(email, password).subscribe({
        next: () => this.router.navigate(['/profile']),
        error: err => console.error('Login error:', err),
      });
    },
    error: err => {
      this.serverError = this.errorHandler.reigsterHandlerErrors(err, this.registerForm);
    }
  });
}

}
