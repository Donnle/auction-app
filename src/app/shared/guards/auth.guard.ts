import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isUserAuthorized: boolean;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe({
      next: (isUserAuthorized: boolean) => {
        this.isUserAuthorized = isUserAuthorized;
      },
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isUserAuthorized) {
      this.router.navigate(['/']);
    }
    return this.isUserAuthorized;
  }
}
