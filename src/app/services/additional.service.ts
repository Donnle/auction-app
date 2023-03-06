import { Injectable } from '@angular/core';
import { CityInfo, NormalizeEnd } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AdditionalService {
  calculateDaysLeft(date: number): Date {
    const dateFormat = new Date(date);
    const dateNow = new Date(dateFormat).getTime() - new Date().getTime();
    return new Date(dateNow);
  }

  formatPipeHighestDateType(date: Date): string {
    const ends = this.calculateEnds(date);

    if (date.getMonth() > 1) {
      return `M ${ends.months}`;
    } else if (date.getDate() > 1) {
      return `d ${ends.days}`;
    } else if (date.getHours() > 1) {
      return `H ${ends.hours}`;
    } else if (date.getMinutes() > 1) {
      return `m ${ends.minutes}`;
    } else if (date.getSeconds() > 1) {
      return `s ${ends.seconds}`;
    }

    return '';
  }

  fullCityAddress(city: CityInfo) {
    return `${city.SettlementTypeDescription} ${city.Description}, ${city.RegionsDescription}, ${city.AreaDescription}`;
  }

  private calculateEnds(date: Date): NormalizeEnd {
    const dateLastNumbers = {
      year: +date.getFullYear().toString()[date.getFullYear().toString().length - 1],
      months: +date.getMonth().toString()[date.getMonth().toString().length - 1],
      day: +date.getDate().toString()[date.getDate().toString().length - 1],
      hour: +date.getHours().toString()[date.getHours().toString().length - 1],
      minute: +date.getMinutes().toString()[date.getMinutes().toString().length - 1],
      second: +date.getSeconds().toString()[date.getSeconds().toString().length - 1],
    };

    return {
      years: this.calculateEnd(dateLastNumbers.year, 'рік', 'роки', 'років'),
      months: this.calculateEnd(dateLastNumbers.months, 'місяць', 'місяці', 'місяців'),
      days: this.calculateEnd(dateLastNumbers.day, 'день', 'дні', 'днів'),
      hours: this.calculateEnd(dateLastNumbers.hour, 'година', 'години', 'годин'),
      minutes: this.calculateEnd(dateLastNumbers.minute, 'минута', 'минути', 'минут'),
      seconds: this.calculateEnd(dateLastNumbers.second, 'секунда', 'секунди', 'секунд'),
    };
  }

  private calculateEnd(lastNumber: number, equalOne: string, fromTwoToFive: string, fromSixToNineAndZero: string): string {
    if (lastNumber === 1) {
      return equalOne;
    } else if (1 < lastNumber && lastNumber < 5) {
      return fromTwoToFive;
    } else {
      return fromSixToNineAndZero;
    }
  }
}
