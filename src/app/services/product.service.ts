import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { AuthService } from './auth.service';
import { RequestsService } from './requests.service';
import { Product, ProductResponse, Response } from '../interfaces';
import { SOCKET_CHANNELS } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productData$: BehaviorSubject<Product> = new BehaviorSubject<Product>({} as Product);
  socket: Socket;
  isLoggedIn: boolean = true;

  @AutoUnsubscribe() isLoggedInSubs: Subscription;

  constructor(private requestsService: RequestsService, private router: Router, private authService: AuthService) {
    this.isLoggedInSubs = this.authService.isUserAuthorized$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  get productData() {
    return this.productData$.getValue();
  }

  set productData(data) {
    this.productData$.next(data);
  }

  getProductData(productId: string): Observable<void | Response<ProductResponse>> {
    return this.requestsService.getProductInfo(productId).pipe(map(
      (response: Response<ProductResponse>) => {
        if (response.success) {
          this.productData$.next(response.data.product);
        }

        return response;
      },
    ), catchError(async () => {
        await this.router.navigate(['not-found']);
      },
    ));
  }

  changeBet(raisedBet: number) {
    if (!this.isLoggedIn) {
      return alert('Потрібно ввійти для того щоб підняти ставку');
    }

    const data = {
      productId: this.productData._id,
      raisedBet,
    };

    this.productData = { ...this.productData, currentBet: raisedBet };
    this.socket.emit(SOCKET_CHANNELS.RAISE_BET, data);
  }

  configureSocket() {
    if (this.socket) {
      this.disconnectSocket();
    }

    this.socket = io();
    this.socket.on(SOCKET_CHANNELS.CONNECT, () => {
      const currentProductId = this.productData._id;

      console.log('Connected to product: ', currentProductId);

      this.socket.emit(SOCKET_CHANNELS.REGISTER_SUBSCRIBER, this.productData);

      this.socket.on(SOCKET_CHANNELS.CHANGE_CURRENT_BET, (productInfo) => {
        this.productData = productInfo;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from product: ', currentProductId);
      });
    });
  }

  disconnectSocket() {
    this.socket.disconnect();
  }
}
