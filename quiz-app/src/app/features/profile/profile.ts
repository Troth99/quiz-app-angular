import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService, ToastService, User, UserService } from '../../core';
import { Timestamp } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom, Subscription } from 'rxjs';
import { Loading } from '../../shared';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, Loading],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {
  showChangeName = false;
  showMoreOptions = false;

  private subscription = new Subscription();

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  user = signal<User | null>(null);
  uid = this.authService.uid;

  saving = false;
  ngOnInit(): void {
    if (!this.uid) return;

    const userSub = this.userService.getUser(this.uid).subscribe((rawData) => {
      if (!rawData) return;

      const parsed: User = {
        ...rawData,
        createdAt:
          rawData['createdAt'] instanceof Timestamp
            ? rawData['createdAt'].toDate()
            : rawData['createdAt'],
        lastLogin:
          rawData['lastLogin'] instanceof Timestamp
            ? rawData['lastLogin'].toDate()
            : rawData['lastLogin'],
      } as User;

      this.user.set(parsed);
    });

    const routeSub = this.route.queryParamMap.subscribe((params) => {
      const message = params.get('message');
      if (message === 'already-logged-in') {
        this.toast.show('You are already logged in.');
      }
    });

    this.subscription.add(userSub);
    this.subscription.add(routeSub);
  }

  toggleMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }

  closeMoreOptions() {
    this.showMoreOptions = false;
  }

  disableAccount() {
    this.showMoreOptions = false;
  }

  changePassword() {
    this.router.navigate(['profile/change-password']);
  }

  async changeAvatar(event: Event) {
    if (!this.auth.currentUser) {
      await this.authService.logout();
      this.router.navigate(['/auth/login']);
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const apiKey = '844b750f8696c887633d12684dff203e';

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      const imageUrl = data.data.url;
      await this.updateUserProfilePhotoUrl(imageUrl);
    } catch (error) {
      console.error('failed to updated the picture', (error as Error).message);
    }
  }

  
  viewMyCreatedQuizzes() {
    this.router.navigate(['profile/my-created-quizzes']);
  }

  async updateUserProfilePhotoUrl(url: string) {
    this.user.update((u) => (u ? { ...u, photoUrl: url } : u));

    if (this.uid) {
      try {
        await firstValueFrom(
          this.userService.updateUser(this.uid, { photoUrl: url })
        );
        this.toast.show('Profile picture was updated succesfully');
      } catch (error) {
        this.toast.show(
          'There was error updated profile picture, please log in again.'
        );
        console.error(error);
      }
    }
  }

  changeDisplayName() {
    this.router.navigate(['profile/change-display-name']);
  }

  async deleteAccount() {
    if (
      !confirm(
        'Are you sure you want to delete your account? This action is irreversible.'
      )
    )
      return;

    const password = prompt('Enter your password to confirm account deletion');
    if (!password) {
      this.toast.show('Password is required to delete account.');
      return;
    }

    this.saving = true;

    try {
      await this.authService.deleteUser(password);
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error) {
      console.error(error);
      this.toast.show(
        'Failed to delete account. Please check your password and try again.'
      );
    } finally {
      this.saving = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
