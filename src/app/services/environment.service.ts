import { Injectable } from '@angular/core';
import { Environment } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  environment: Environment = {
    api: 'https://auctiox-api.onrender.com',
  };

  constructor() {
  }
}
