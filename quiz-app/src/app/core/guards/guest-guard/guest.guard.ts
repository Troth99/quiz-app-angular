import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
  if (this.auth.isLoggedIn()) {
    return true;
  } else {
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: {
        message: 'login-required',
        redirectUrl: state.url,  
      }
    });
  }
}
}
