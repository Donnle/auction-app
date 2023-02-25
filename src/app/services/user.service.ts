import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../interfaces';
import { LOCAL_STORAGE } from '../enums';
import { RequestsService } from './requests.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userData$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>({} as UserData);

  constructor(private requestsService: RequestsService) {
  }

  get userId(): string {
    return this.userData$.getValue().id;
  }

  get userData() {
    return this.userData$.getValue();
  }

  set userData(data: UserData) {
    this.userData$.next(data);
  }

  saveUserData(userData: UserData) {
    this.userData$.next(userData);
    localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(userData));
  }

  onLogout() {
    this.userData$.next({} as UserData);
    localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
  }

  refreshUserData() {
    this.requestsService.getUserData().subscribe((response) => {
      this.userData = response.data;
    });
  }
}
