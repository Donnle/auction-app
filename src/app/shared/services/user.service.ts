import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Response, UserData, UserDataResponse } from '../../interfaces';
import { LOCAL_STORAGE } from '../../enums';
import { RequestsService } from './requests.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userData$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>({} as UserData);

  constructor(private requestsService: RequestsService) {
  }

  get userData(): UserData {
    return this.userData$.getValue();
  }

  set userData(data: UserData) {
    this.userData$.next(data);
  }

  get userId(): string {
    return this.userData.id;
  }

  saveUserData(userData: UserData) {
    this.userData = userData;
    localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(userData));
  }

  onLogout() {
    this.userData = {} as UserData;
    localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
  }

  refreshUserData() {
    this.requestsService.getUserData().subscribe({
      next: (response: Response<UserDataResponse>) => {
        this.userData = response.data.user;
      },
    });
  }
}
