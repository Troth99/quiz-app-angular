import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean| UrlTree {
    if(this.auth.isLoggedIn()) {
        return true
    }else {
        alert('You must log in in order to see your profile');
        return this.router.createUrlTree(['/auth/login'])
    }
  }
}
