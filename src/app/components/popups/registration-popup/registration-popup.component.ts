import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ButtonData } from '../../../interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration-popup',
  templateUrl: './registration-popup.component.html',
  styleUrls: ['./registration-popup.component.scss'],
})
export class RegistrationPopupComponent {
  loginForm: FormGroup;
  buttonData: ButtonData = {
    text: 'Submit',
    size: 'long',
    type: 'orange',
  };

  @ViewChild('registration') registrationModal: any;

  constructor(private authService: AuthService, private toastrService: ToastrService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      name: new FormControl('', [
        Validators.required,
        this.symbolsValidator(/^[а-яА-Яa-zA-Zє-їЄ-Ї]+$/),
      ]),
      surname: new FormControl('', [
        Validators.required,
        this.symbolsValidator(/^[а-яА-Яa-zA-Zє-їЄ-Ї]+$/),
      ]),
      phone: new FormControl('', [
        Validators.required,
        this.symbolsValidator(/^[0-9+]+$/),
      ]),
    });
  }

  symbolsValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = !nameRe.test(control.value) && control.value.length >= 1;
      return forbidden ? { includeNotAvailableSymbols: true } : null;
    };
  }

  onSubmit(): void {
    this.authService.registration(this.loginForm.value).subscribe({
      next: () => this.registrationModal.close(),
      error: ({ error }) => {
        this.toastrService.info(error.data.message);
      },
    });
  }
}
