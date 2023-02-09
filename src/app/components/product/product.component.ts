import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces';
import { AdditionalService } from '../../services/additional.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @Input() product: Product;

  constructor(public additionalService: AdditionalService) {
  }

  getHighestDateType(date: Date): string {
    const timeLeft = this.additionalService.calculateDaysLeft(date);
    return this.additionalService.formatPipeHighestDateType(timeLeft);
  }
}
