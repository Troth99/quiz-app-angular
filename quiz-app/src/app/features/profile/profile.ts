import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService, ToastService, User, UserService } from '../../core';
import { Timestamp } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Loading } from '../../shared';



@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, Loading],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit, OnDestroy {

  showChangeName = false
  showMoreOptions = false;
  private subscription = new Subscription();

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  user = signal<User | null>(null);
  uid = this.authService.uid;

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

  async changePassword() {}

  async changeAvatar() {
    console.log('changing avatar');
  }

   changeDisplayName() {
    this.router.navigate(['profile/change-display-name'])
  }

  async deleteAccount() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
