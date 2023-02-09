import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { RequestsService } from '../../services/requests.service';
import { ButtonData, Product, ProductResponse, ProductsResponse, Response } from '../../interfaces';
import { AdditionalService } from '../../services/additional.service';
import { MODALS } from '../../enums';
import { RaiseBetPopupComponent } from '../../components/popups/raise-bet-popup/raise-bet-popup.component';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  recommendationProducts: Product[];
  refreshTimeInterval: NodeJS.Timer;
  productInfo: Product;
  timeLeft: Date;
  dateFormat: string;
  isButtonsDisabled: boolean = false;

  buyNowData: ButtonData = {
    text: 'Купити зараз',
    type: 'orange',
    size: 'large',
  };
  betData: ButtonData = {
    text: 'Підняти ставку',
    type: 'transparent',
    size: 'large',
  };

  constructor(
    private route: ActivatedRoute,
    private requestsService: RequestsService,
    private additionalService: AdditionalService,
    private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe({
      next: (params: Params) => {
        const productId = params['productId'];
        this.requestsService.getProductInfo(productId).subscribe({
          next: ({ data, success }: Response<ProductResponse>) => {
            if (success) {
              this.productInfo = data.product;
              this.updateTimer(data.product);
              this.refreshTimeInterval = setInterval(() => this.updateTimer(data.product), 1000);
            }
          },
          error: async () => {
            await this.router.navigate(['not-found']);
          },
        });
      },
    });

    this.requestsService.getProducts(1, 4).subscribe({
      next: ({ data, success }: Response<ProductsResponse>) => {
        if (success) {
          this.recommendationProducts = data.products;
        }
      },
    });
  }

  updateTimer(product: Product) {
    this.timeLeft = this.additionalService.calculateDaysLeft(product.endDate);
    this.dateFormat = this.additionalService.formatPipeDate(this.timeLeft);

    if (!this.dateFormat) {
      this.isButtonsDisabled = true;
      clearInterval(this.refreshTimeInterval);
    }
  }

  ngOnDestroy() {
    clearInterval(this.refreshTimeInterval);
  }


  openRaiseBet() {
    this.ngxSmartModalService.setModalData(this.productInfo, MODALS.RAISE_BET);
    this.ngxSmartModalService.create(MODALS.RAISE_BET, RaiseBetPopupComponent).open();
  }
}
