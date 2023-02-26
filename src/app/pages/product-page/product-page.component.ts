import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { MODALS, SOCKET_CHANNELS } from '../../enums';
import { ButtonData, Product, ProductsResponse, Response } from '../../interfaces';
import { RequestsService } from '../../services/requests.service';
import { ProductService } from '../../services/product.service';
import { RaiseBetPopupComponent } from '../../components/popups/raise-bet-popup/raise-bet-popup.component';
import { BuyNowPopupComponent } from '../../components/popups/buy-now-popup/buy-now-popup.component';
import { AuthService } from '../../services/auth.service';

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

  @AutoUnsubscribe() isLoggedInSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
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

    this.productService.productData$.subscribe({
      next: (productData: Product) => {
        this.productData = productData;
      },
    });

    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe({
      next: (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      },
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

  configureSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io();
    this.socket.on(SOCKET_CHANNELS.CONNECT, () => {
      console.log('Connected');

      this.socket.emit(SOCKET_CHANNELS.REGISTER_SUBSCRIBER, this.productData.id);

      this.socket.on(SOCKET_CHANNELS.CHANGE_CURRENT_BET, (productInfo) => {
        this.productData.currentBet = productInfo.currentBet;
      });
    });
  }

  openBuyNow() {
    if (!this.isLoggedIn) {
      return alert('Потрібно ввійти для того щоб придбати товар');
    }
    this.ngxSmartModalService.create(MODALS.BUY_NOW, BuyNowPopupComponent).open();
  }

  openRaiseBet() {
    this.ngxSmartModalService.create(MODALS.RAISE_BET, RaiseBetPopupComponent).open();
  }

  ngOnDestroy() {
    this.productService.disconnectSocket();
  }
}
