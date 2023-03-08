import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../interfaces';
import { AdditionalService } from '../../services/additional.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  daysLeft: Date;
  highestDate: string;
  @Input() product: Product;

  constructor(public additionalService: AdditionalService) {
  }

  ngOnInit() {
    this.daysLeft = this.additionalService.calculateDaysLeft(this.product.endDate);
    this.highestDate = this.getHighestDateType(this.product.endDate);
  }

  private getHighestDateType(date: number): string {
    const timeLeft = this.additionalService.calculateDaysLeft(date);
    return this.additionalService.formatPipeHighestDateType(timeLeft);
  }
}
