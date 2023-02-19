import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Socket } from 'socket.io-client';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { MODALS } from '../../enums';
import { ButtonData, Product, ProductsResponse, Response } from '../../interfaces';
import { RequestsService } from '../../services/requests.service';
import { ProductService } from '../../services/product.service';
import { RaiseBetPopupComponent } from '../../components/popups/raise-bet-popup/raise-bet-popup.component';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  recommendationProducts: Product[];
  productData: Product;
  timeLeft: Date;
  dateFormat: string;
  socket: Socket;
  isLoggedIn: boolean = false;

  @AutoUnsubscribe() isLoggedInSubs: Subscription;

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
    private ngxSmartModalService: NgxSmartModalService,
    public productService: ProductService,
  ) {
  }

  ngOnInit() {
    this.getRecommendationProducts();

    this.route.params.subscribe({
      next: (params: Params) => {
        const productId = params['productId'];
        this.productService.getProductData(productId).subscribe({
          next: () => {
            this.productService.configureSocket();
          },
        });
      },
    });

    this.productService.productData$.subscribe((productData: Product) => {
      this.productData = productData;
    });
  }

  getRecommendationProducts(page: number = 1, count: number = 4) {
    this.requestsService.getProducts(page, count).subscribe({
      next: ({ data, success }: Response<ProductsResponse>) => {
        if (success) {
          this.recommendationProducts = data.products;
        }
      },
    });
  }

  openRaiseBet() {
    this.ngxSmartModalService.create(MODALS.RAISE_BET, RaiseBetPopupComponent).open();
  }

  ngOnDestroy() {
    this.productService.disconnectSocket()
  }
}
