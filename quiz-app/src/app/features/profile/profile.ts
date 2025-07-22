import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService, ToastService, User, UserService } from '../../core';
import { Timestamp } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Loading } from '../../shared';
import { Auth } from '@angular/fire/auth';
import { Dropbox } from 'dropbox';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, Loading],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
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

  // Инициализирай Dropbox с токен (замени с твоя токен)
  private dbx = new Dropbox({ accessToken: 'ТУК_ДАЙ_СИ_ТОКЕНА_ОТ_ДРОПБОКС' });

  ngOnInit(): void {
    if (!this.uid) return;

    const userSub = this.userService.getUser(this.uid).subscribe(rawData => {
      if (!rawData) return;

      const parsed: User = {
        ...rawData,
        createdAt: rawData['createdAt'] instanceof Timestamp ? rawData['createdAt'].toDate() : rawData['createdAt'],
        lastLogin: rawData['lastLogin'] instanceof Timestamp ? rawData['lastLogin'].toDate() : rawData['lastLogin'],
      } as User;

      this.user.set(parsed);
    });

    const routeSub = this.route.queryParamMap.subscribe(params => {
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

  async changePassword() {
    this.router.navigate(['profile/change-password']);
  }

  async changeAvatar(event: Event) {
    // const input = event.target as HTMLInputElement;
    // if (!input.files?.length) return;

    // const file = input.files[0];

    // try {
    //   const response = await this.dbx.filesUpload({ path: '/' + file.name, contents: file });
    //   const linkResponse = await this.dbx.sharingCreateSharedLinkWithSettings({ path: response.result.path_lower });
    //   const url = linkResponse.result.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');

    //   if (!this.user()) return;

    //   await this.updateUserProfilePhotoUrl(url);

    //   this.user.update(u => u ? { ...u, photoUrl: url } : u);

    // } catch (error) {
    //   console.error('Error uploading avatar:', error);
    //   this.toast.show('Error uploading avatar.');
    // }
  }

  async updateUserProfilePhotoUrl(url: string) {
    // if (!this.user()) return;
   
    // try {
    //   await this.userService.updateUser(this.user()!.uid, { photoUrl: url });
    //   this.toast.show('Avatar updated successfully.');
    // } catch (error) {
    //   console.error('Error updating user profile photo URL:', error);
    //   this.toast.show('Error updating avatar in profile.');
    // }
  }

  changeDisplayName() {
    this.router.navigate(['profile/change-display-name']);
  }

  async deleteAccount() {
    // Имплементирай изтриване на акаунт
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
