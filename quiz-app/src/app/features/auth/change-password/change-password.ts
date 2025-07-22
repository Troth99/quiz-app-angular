import {
  Component,
  inject,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  User,
} from '@angular/fire/auth';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class changePassword {
  private fb = inject(FormBuilder);
  private injector = inject(EnvironmentInjector);
  private auth = inject(Auth);
  private route = inject(Router);
  private authService = inject(AuthService);

  user: User | null = null;

  changePasswordForm!: FormGroup;
  submitted = false;
  loading = false;

  success: string | null = null;
  error: string | null = null;

  currentPasswordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;

  constructor() {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [
          this.passwordsMatchValidator,
          this.newPasswordDiffersValidator,
        ],
      }
    );
  }

  private passwordsMatchValidator(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      const errors = group.get('confirmPassword')?.errors;
      if (errors && errors['mismatch']) {
        delete errors['mismatch'];
        group
          .get('confirmPassword')
          ?.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }

  private newPasswordDiffersValidator(group: AbstractControl) {
    const current = group.get('currentPassword')?.value;
    const newPass = group.get('newPassword')?.value;

    if (current && newPass && current === newPass) {
      group.get('newPassword')?.setErrors({ sameAsCurrent: true });
    } else {
      const errors = group.get('newPassword')?.errors;
      if (errors && errors['sameAsCurrent']) {
        delete errors['sameAsCurrent'];
        group
          .get('newPassword')
          ?.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }

  async onSubmit() {
    this.submitted = true;
    this.error = null;
    this.success = null;

    if (this.changePasswordForm.invalid) return;

    const { currentPassword, newPassword } = this.changePasswordForm.value;
    this.loading = true;

    try {
      await runInInjectionContext(this.injector, async () => {
        const user = this.auth.currentUser;
        if (!user || !user.email) {
          await this.authService.logout();
          this.route.navigate(['/auth/login']);
          throw new Error('User not authenticated');
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
      });

      await runInInjectionContext(this.injector, async () => {
        const user = this.auth.currentUser;
        if (!user) {
          await this.authService.logout();
          this.route.navigate(['/auth/login']);
          throw new Error('User not authenticated');
        }
        await updatePassword(user, newPassword);
      });

      this.success = 'Password updated successfully.';
      this.changePasswordForm.reset();
      this.submitted = false;
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/wrong-password':
            this.error = 'Current password is incorrect.';
            break;
          case 'auth/weak-password':
            this.error = 'New password is too weak.';
            break;
          case 'auth/user-not-found':
            this.error = 'User was not found.';
            break;
          case 'auth/requires-recent-login':
            this.error = 'You should log in again, to change password.';
            await this.authService.logout();
            this.route.navigate(['/auth/login']);
            break;
          case 'auth/too-many-requests':
            this.error = 'Too many attempts, please wait before trying again.';
            break;
          default:
            this.error = err.message;
        }
      } else if (err instanceof Error) {
        this.error = err.message;
      } else {
        this.error = 'Unknown error occured.';
      }
    } finally {
      this.loading = false;
    }
  }

  get currentPassword() {
    return this.changePasswordForm.get('currentPassword');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  goToProfile() {
    this.route.navigate(['profile']);
  }
}
