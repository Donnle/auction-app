import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Login, LoginData, Logout, Refresh, Registration, RegistrationData, Response } from '../interfaces';
import { UserService } from './user.service';
import { LOCAL_STORAGE } from '../enums';
import { HeadersService } from './headers.service';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private userService: UserService, private headersService: HeadersService, private environmentService: EnvironmentService) {
    this.refreshAccessToken();
  }

  login(userData: LoginData): Observable<Response<Login>> {
    return this.http.post<Response<Login>>(`${this.environmentService.environment.api}/api/auth/login`, userData)
      .pipe(map(({ data, success }: Response<Login>) => {
        if (success) {
          this.isLoggedIn$.next(true);
          console.log('Success login! Data info: ', data);

          this.userService.saveUserData(data.user);
          console.log('User data: ', data.user);

          this.saveAccessToken(data.accessToken);
          console.log('accessToken: ', data.accessToken, 'refreshToken: ', data.refreshToken);
        }
        return { data, success };
      }));
  }

  registration(userData: RegistrationData): Observable<Response<Registration>> {
    return this.http.post<Response<Registration>>(`${this.environmentService.environment.api}/api/auth/registration`, userData)
      .pipe(map(({ data, success }: Response<Registration>) => {
        if (success) {
          this.isLoggedIn$.next(true);
          console.log('Success registration! Data info: ', data);

          this.userService.saveUserData(data.user);
          console.log('User data: ', data.user);

          this.saveAccessToken(data.accessToken);
          console.log('accessToken: ', data.accessToken, 'refreshToken: ', data.refreshToken);
        }
        return { data, success };
      }));
  }

  refreshAccessToken(): void {
    this.http.get<Response<Refresh>>(`${this.environmentService.environment.api}/api/auth/refresh`).subscribe({
      next: ({ data, success }: Response<Refresh>) => {
        if (success) {
          this.isLoggedIn$.next(true);
          this.saveAccessToken(data.accessToken);
          this.userService.saveUserData(data.user);
          console.log('accessToken: ', data.accessToken, 'refreshToken: ', data.refreshToken);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  logout(): void {
    this.http.post<Response<Logout>>(`${this.environmentService.environment.api}/api/auth/logout`, {}).subscribe({
      next: ({ success }: Response<Logout>) => {
        if (success) {
          this.isLoggedIn$.next(false);
          this.removeAccessToken();
          this.userService.onLogout();
        }
      },
    });
  }

  private saveAccessToken(accessToken: string): void {
    this.headersService.accessToken = accessToken;
    localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, JSON.stringify(accessToken));
  }

  private removeAccessToken(): void {
    this.headersService.accessToken = '';
    localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
  }
}
