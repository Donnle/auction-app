import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonData, Product } from '../../../interfaces';
import { AdditionalService } from '../../../services/additional.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-raise-bet-popup',
  templateUrl: './raise-bet-popup.component.html',
  styleUrls: ['./raise-bet-popup.component.scss'],
})
export class RaiseBetPopupComponent implements OnInit {
  raiseBetForm: FormGroup;
  productData: Product;
  dateFormat: string;
  buttonData: ButtonData = {
    text: 'Підняти ставку',
    type: 'orange',
    size: 'medium',
  };

  @Output() changeBet = new EventEmitter();

  constructor(public additionalService: AdditionalService, private productService: ProductService) {
  }

  ngOnInit(): void {
    this.productService.productData$.subscribe((productData) => {
      this.productData = productData;

      this.raiseBetForm = new FormGroup({
        raisedBet: new FormControl(0, [
          Validators.required,
          Validators.min(this.productData.currentBet + this.productData.minStep),
          Validators.max(this.productData.buyNowPrice),
        ]),
      });
    });
  }

  onSubmit() {
    this.changeBet.emit(this.raiseBetForm.value.raisedBet);
    this.raiseBetForm.reset();
  }
}
