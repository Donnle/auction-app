import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonData, Product } from '../../../interfaces';
import { AdditionalService } from '../../../services/additional.service';

@Component({
  selector: 'app-raise-bet-popup',
  templateUrl: './raise-bet-popup.component.html',
  styleUrls: ['./raise-bet-popup.component.scss'],
})
export class RaiseBetPopupComponent implements OnChanges {
  raiseBetForm: FormGroup;
  dateFormat: string;
  buttonData: ButtonData = {
    text: 'Підняти ставку',
    type: 'orange',
    size: 'medium',
  };

  @Output() changeBet = new EventEmitter();
  @Input() productInfo: Product;

  constructor(public additionalService: AdditionalService) {
  }

  // Change form when "@Input() productInfo: Product" change
  ngOnChanges(changes: SimpleChanges): void {
    this.raiseBetForm = new FormGroup({
      raisedBet: new FormControl(0, [
        Validators.min(this.productInfo.currentBet + this.productInfo.minStep),
        Validators.max(this.productInfo.buyNowPrice),
      ]),
    });
  }

  onSubmit() {
    this.changeBet.emit(this.raiseBetForm.value.raisedBet);
    this.raiseBetForm.reset();
  }
}
