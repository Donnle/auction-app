import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ButtonData, Product } from '../../../interfaces';
import { AdditionalService } from '../../../services/additional.service';
import { MODALS } from '../../../enums';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-raise-bet-popup',
  templateUrl: './raise-bet-popup.component.html',
  styleUrls: ['./raise-bet-popup.component.scss'],
})
export class RaiseBetPopupComponent implements OnInit, AfterViewInit {
  raiseBetForm: FormGroup;
  productInfo: Product;
  dateFormat: string;
  buttonData: ButtonData = {
    text: 'Підняти ставку',
    type: 'orange',
    size: 'medium',
  };

  @ViewChild('raiseBet') raiseBetModal: any;

  constructor(public additionalService: AdditionalService, private ngxSmartModalService: NgxSmartModalService) {
  }

  onSubmit() {
    console.log(this.raiseBetForm.value);
  }

  ngOnInit(): void {
    this.raiseBetForm = new FormGroup({
      raisedBet: new FormControl('', []),
    });
  }

  ngAfterViewInit(): void {
    this.ngxSmartModalService.getModal(MODALS.RAISE_BET).onOpen.subscribe((modal) => {
      this.productInfo = modal.getData();
    });
  }
}
