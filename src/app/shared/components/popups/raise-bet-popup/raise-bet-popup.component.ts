import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { ButtonData, Product } from '../../../../interfaces';
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
  @AutoUnsubscribe() productDataSubscription: Subscription;

  constructor(public additionalService: AdditionalService, private productService: ProductService) {
  }

  ngOnInit(): void {
    this.raiseBetForm = new FormGroup({
      raisedBet: new FormControl(0, [
        Validators.required,
      ]),
    });

    this.productDataSubscription = this.productService.productData$.subscribe({
      next: (productData: Product) => {
        this.productData = productData;

        const currentBet = this.productData.currentBet + this.productData.minStep;
        const buyNowPrice = this.productData.buyNowPrice;

        this.raiseBetForm.get('raisedBet')?.setValidators([
          Validators.required,
          Validators.min(currentBet),
          Validators.max(buyNowPrice),
        ]);

        this.raiseBetForm.get('raisedBet')?.updateValueAndValidity();
      },
    });
  }

  onSubmit() {
    this.changeBet.emit(this.raiseBetForm.value.raisedBet);
    this.raiseBetForm.reset();
  }
}
