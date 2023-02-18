import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import * as socketIo from 'socket.io-client';
import { RequestsService } from '../../services/requests.service';
import { ButtonData, Product, ProductResponse, ProductsResponse, Response } from '../../interfaces';
import { AdditionalService } from '../../services/additional.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  recommendationProducts: Product[];
  refreshTimeInterval: NodeJS.Timer;
  productInfo$: BehaviorSubject<Product> = new BehaviorSubject<Product>({} as Product);
  productInfo: Product;
  timeLeft: Date;
  dateFormat: string;
  isButtonsDisabled: boolean = false;
  clientSocket: any;

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
              this.productInfo$.next(data.product);
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

    this.clientSocket = socketIo.connect();
    this.productInfo$.subscribe((productInfo) => {
      this.productInfo = productInfo;
      if (productInfo._id) {
        this.clientSocket.emit('close');
        this.clientSocket.emit('subscribe-to-bets', productInfo);
        this.clientSocket.on('update-bet', (data: Product) => {
          productInfo.currentBet = data.currentBet;
          this.productInfo$.next(productInfo);
        });
      }
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
    this.clientSocket.emit('close');
    clearInterval(this.refreshTimeInterval);
  }
}
