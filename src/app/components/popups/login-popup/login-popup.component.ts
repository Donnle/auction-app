import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ButtonData } from '../../../interfaces';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss'],
})
export class LoginPopupComponent {
  loginForm: FormGroup;
  buttonData: ButtonData = {
    text: 'Submit',
    size: 'long',
    type: 'orange',
  };

  @ViewChild('login') loginModal: any;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private ngxSmartModalService: NgxSmartModalService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  onSubmit(): void {
    this.authService.login({
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    }).subscribe({
      next: () => this.loginModal.close(),
      error: ({ error }) => {
        console.log('Error: ', error.data.message);
        alert(error.data.message);
      },
    });
  }
}
