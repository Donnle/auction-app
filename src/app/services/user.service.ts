import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Response, UserData } from '../interfaces';
import { RequestsService } from './requests.service';
import { LOCAL_STORAGE } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userData$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>({} as UserData);

  constructor(private requestService: RequestsService) {
  }

  get userId(): string {
    return this.userData$.getValue().id;
  }

  getUserData(): void {
    this.requestService.getUserData(this.userId).subscribe({
      next: ({ data, success }: Response<UserData>) => {
        if (success) {
          this.saveUserData(data);
        }
      },
    });
  }

  saveUserData(userData: UserData) {
    this.userData$.next(userData);
    localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(userData));
  }

  onLogout() {
    this.userData$.next({} as UserData);
    localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
  }
}
