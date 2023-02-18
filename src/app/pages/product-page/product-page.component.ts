import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { MODALS, SOCKET_CHANNELS } from '../../enums';
import { RequestsService } from '../../services/requests.service';
import { ButtonData, Product, ProductResponse, ProductsResponse, Response } from '../../interfaces';
import { RaiseBetPopupComponent } from '../../components/popups/raise-bet-popup/raise-bet-popup.component';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit {
  recommendationProducts: Product[];
  productInfo: Product;
  timeLeft: Date;
  dateFormat: string;
  socket: Socket;

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
    private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
  }

  ngOnInit() {
    this.getRecommendationProducts();

    this.route.params.subscribe({
      next: (params: Params) => {
        const productId = params['productId'];
        this.getProductInfo(productId);
      },
    });
  }

  getProductInfo(productId: string) {
    this.requestsService.getProductInfo(productId).subscribe({
      next: ({ data, success }: Response<ProductResponse>) => {
        if (success) {
          this.productInfo = data.product;
          this.configureSocket();
        }
      },
      error: async () => {
        await this.router.navigate(['not-found']);
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

  changeBet(raisedBet: number) {
    const data = {
      productId: this.productInfo._id,
      raisedBet,
    };

    this.productInfo.currentBet = raisedBet;
    this.socket.emit(SOCKET_CHANNELS.RAISE_BET, data);
  }

  configureSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io();
    this.socket.on(SOCKET_CHANNELS.CONNECT, () => {
      console.log('Connected');

      this.socket.emit(SOCKET_CHANNELS.REGISTER_SUBSCRIBER, this.productInfo);

      this.socket.on(SOCKET_CHANNELS.CHANGE_CURRENT_BET, (productInfo) => {
        this.productInfo.currentBet = productInfo.currentBet;
      });
    });

  }

  openRaiseBet() {
    this.ngxSmartModalService.setModalData(this.productInfo, MODALS.RAISE_BET);
    this.ngxSmartModalService.create(MODALS.RAISE_BET, RaiseBetPopupComponent).open();
  }
}
