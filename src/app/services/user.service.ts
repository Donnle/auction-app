import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../interfaces';
import { LOCAL_STORAGE } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userData$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>({} as UserData);

  get userId(): string {
    return this.userData$.getValue().id;
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
