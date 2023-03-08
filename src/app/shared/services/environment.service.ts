import { Injectable } from '@angular/core';
import { Environment } from '../../interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  environment: Environment;

  constructor() {
    this.environment = environment;
    console.log(this.environment);
  }
}
