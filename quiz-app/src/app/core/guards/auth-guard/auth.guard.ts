import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean| UrlTree {
    if (this.auth.isLoggedIn()) {
      return this.router.createUrlTree(['/profile'], { queryParams: { message: 'already-logged-in' } });

    }
    return true;
  }
}
