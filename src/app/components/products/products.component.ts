import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces';
import { AdditionalService } from '../../services/additional.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  @Input() products: Product[];

  constructor(public additionalService: AdditionalService) {
  }
}
