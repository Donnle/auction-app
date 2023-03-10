import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { RequestsService } from '../../shared/services/requests.service';
import {
  ButtonData,
  CityInfo,
  Department,
  NovaPoshtaResponse,
  Response,
  UserData, UserDataResponse,
} from '../../interfaces';
import { UserService } from '../../shared/services/user.service';
import { AdditionalService } from '../../shared/services/additional.service';
import { CityPipe } from '../../shared/pipes/city.pipe';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  deliveryForm: FormGroup;
  userData: UserData;

  deliverySaveButton: ButtonData = {
    text: 'Зберегти',
    type: 'orange',
    size: 'medium',
  };

  cities: CityInfo[];
  departments: Department[];
  @AutoUnsubscribe() userDataSubscription: Subscription;
  private inputSubject$ = new BehaviorSubject<string>('');
  private cityName$ = this.inputSubject$.asObservable().pipe(debounceTime(300), distinctUntilChanged());

  constructor(private requestsService: RequestsService, private userService: UserService, private additionalService: AdditionalService) {
  }

  get selectedCity(): CityInfo | undefined {
    return this.cities?.find((city: CityInfo) => city.Ref === this.deliveryForm.value.selectedCityRef);
  }

  get selectedDepartment(): Department | undefined {
    return this.departments?.find((department: Department) => department.Ref === this.deliveryForm.value.selectedDepartmentRef);
  }

  ngOnInit() {
    this.deliveryForm = new FormGroup({
      selectedCityRef: new FormControl(),
      selectedDepartmentRef: new FormControl(),
    });

    this.userDataSubscription = this.userService.userData$.subscribe((userData: UserData) => {
      this.userData = userData;
      this.deliveryForm.patchValue({
        selectedCityRef: userData.deliveryCity || 'не вказано',
        selectedDepartmentRef: userData.deliveryDepartment || 'не вказано',
      });
    });

    this.getCities();
    this.cityName$.subscribe({
      next: (cityName: string) => {
        this.getCities(cityName);
      },
    });
  }

  getDepartments() {
    this.deliveryForm.get('selectedDepartmentRef')?.reset();

    const cityName = this.selectedCity?.Description;
    if (!cityName) {
      return;
    }

    this.requestsService.getAvailableDeliveryDepartments(cityName).subscribe({
      next: (response: NovaPoshtaResponse<Department[]>) => {
        this.departments = response.data;
      },
    });
  }

  saveDeliveryAddress() {
    const selectedCity = this.selectedCity;
    const selectedDepartment = this.selectedDepartment;

    if (!selectedCity || !selectedDepartment) {
      return;
    }

    const userDeliveryInfo = {
      userId: this.userData.id,
      deliveryCity: this.additionalService.fullCityAddress(selectedCity),
      deliveryDepartment: selectedDepartment.Description,
    };

    this.requestsService.saveDeliveryAddress(userDeliveryInfo).subscribe({
      next: (response: Response<UserDataResponse>) => {
        this.userService.userData = response.data.user;
      },
    });
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.inputSubject$.next(inputElement.value);
  }

  private getCities(cityName: string = '') {
    this.requestsService.getAvailableDeliveryAddresses(cityName).subscribe({
      next: (response: NovaPoshtaResponse<CityInfo[]>) => {
        this.cities = response.data;
      },
    });
  }
}
