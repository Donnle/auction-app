import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ButtonData, Product } from '../../../interfaces';
import { AdditionalService } from '../../../services/additional.service';

@Component({
  selector: 'app-raise-bet-popup',
  templateUrl: './raise-bet-popup.component.html',
  styleUrls: ['./raise-bet-popup.component.scss'],
})
export class RaiseBetPopupComponent implements OnInit {
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

  onSubmit() {
    this.changeBet.emit(this.raiseBetForm.value.raisedBet);
  }

  ngOnInit(): void {
    this.raiseBetForm = new FormGroup({
      raisedBet: new FormControl('', []),
    });
  }
}
