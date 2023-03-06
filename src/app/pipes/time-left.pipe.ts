import { Pipe, PipeTransform } from '@angular/core';
import { TimeLeft } from '../interfaces';

@Pipe({
  name: 'timeLeft',
})
export class TimeLeftPipe implements PipeTransform {

  transform(value: TimeLeft, ...args: unknown[]): unknown {
    return `${value.daysLeft} days, ${value.hoursLeft} hours, ${value.minutesLeft} minutes, ${value.secondsLeft} seconds`;
  }

}
