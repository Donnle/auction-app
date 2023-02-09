import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ButtonData, UserData } from '../../interfaces';
import { MODALS } from '../../enums';
import { LoginPopupComponent } from '../popups/login-popup/login-popup.component';
import { RegistrationPopupComponent } from '../popups/registration-popup/registration-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isUserAuthorized: boolean = false;
  isMenuOpened: boolean = false;
  userData: UserData;

  registrationButtonData: ButtonData = {
    text: 'Sign up',
    size: 'medium',
    type: 'transparent',
  };

  loginButtonData: ButtonData = {
    text: 'Sign in',
    size: 'medium',
    type: 'orange',
  };

  constructor(private userService: UserService, private authService: AuthService, public ngxSmartModalService: NgxSmartModalService) {
  }

  ngOnInit() {
    this.authService.isUserAuthorized$.subscribe({
      next: (isUserAuthorized: boolean) => {
        this.isUserAuthorized = isUserAuthorized;
      },
    });

    this.userService.userData$.subscribe({
      next: (userData: UserData) => {
        this.userData = userData;
      },
    });
  }

  handleOpenMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }


  logout() {
    this.isMenuOpened = false;
    this.authService.logout();
  }

  openLoginModal() {
    this.ngxSmartModalService.create(MODALS.LOGIN, LoginPopupComponent).open();
  }

  openRegistrationModal() {
    this.ngxSmartModalService.create(MODALS.REGISTRATION, RegistrationPopupComponent).open();
  }
}
