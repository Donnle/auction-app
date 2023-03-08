import { Pipe, PipeTransform } from '@angular/core';
import { CityInfo } from '../../interfaces';
import { AdditionalService } from '../services/additional.service';

@Pipe({
  name: 'city',
})
export class CityPipe implements PipeTransform {
  constructor(private additionalService: AdditionalService) {
  }

  transform(city: CityInfo, ...args: unknown[]): string {
    return this.additionalService.fullCityAddress(city);
  }
}
