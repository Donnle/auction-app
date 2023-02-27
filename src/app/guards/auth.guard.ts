import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isLoggedIn: boolean;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe({
      next: (isUserAuthorized: boolean) => {
        this.isLoggedIn = isUserAuthorized;
      },
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isLoggedIn) {
      this.router.navigate(['/']);
    }
    return this.isLoggedIn;
  }
}
