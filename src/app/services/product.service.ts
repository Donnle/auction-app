import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { AuthService } from './auth.service';
import { RequestsService } from './requests.service';
import {
  BalanceResponse,
  Product,
  ProductResponse,
  RaiseBetData,
  RaiseBetResponse,
  Response,
} from '../interfaces';
import { SOCKET_CHANNELS, TOASTR_MESSAGES } from '../enums';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productData$: BehaviorSubject<Product> = new BehaviorSubject<Product>({} as Product);
  socket: Socket;
  isLoggedIn: boolean = true;

  @AutoUnsubscribe() isLoggedInSubs: Subscription;

  constructor(
    private requestsService: RequestsService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService,
  ) {
    this.isLoggedInSubs = this.authService.isLoggedIn$.subscribe({
      next: (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      },
    });
  }

  get productData(): Product {
    return this.productData$.getValue();
  }

  set productData(data: Product) {
    this.productData$.next(data);
  }

  changeBet(raisedBet: number) {
    if (!this.isLoggedIn) {
      this.toastrService.info(TOASTR_MESSAGES.NEEDS_LOGIN_FOR_RAISE_BET);
      return;
    }

    if (this.userService.userData.balance < raisedBet) {
      this.toastrService.info(TOASTR_MESSAGES.NO_ENOUGH_MONEY_BE);
      return;
    }

    this.requestsService.checkUserBalance().subscribe({
      next: (response: Response<BalanceResponse>) => {
        if (response.data.balance > raisedBet) {
          this.raiseBet(raisedBet);
        } else {
          this.toastrService.info(TOASTR_MESSAGES.NO_ENOUGH_MONEY);
        }
      },
      error: () => {
        this.toastrService.error(TOASTR_MESSAGES.SOMETHING_WENT_WRONG);
      },
    });
  }

  disconnectSocket() {
    this.socket.disconnect();
  }

  configureProductPage(productId: string) {
    this.getProductData(productId).subscribe({
      next: () => this.configureSocket(),
    });
  }

  private getProductData(productId: string): Observable<void | Response<ProductResponse>> {
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

  private configureSocket() {
    if (this.socket) {
      this.disconnectSocket();
    }

    this.socket = io();
    this.socket.on(SOCKET_CHANNELS.CONNECT, () => {
      const currentProductId = this.productData.id;

      console.log('Connected to product: ', currentProductId);

      this.socket.emit(SOCKET_CHANNELS.REGISTER_SUBSCRIBER, this.productData.id);

      this.socket.on(SOCKET_CHANNELS.CHANGE_CURRENT_BET, (productData: Product) => {
        this.productData = productData;
        this.userService.refreshUserData();
      });

      this.socket.on(SOCKET_CHANNELS.ALREADY_SOLD, () => {
        this.toastrService.info(TOASTR_MESSAGES.PRODUCT_ALREADY_SOLD);
      });

      this.socket.on(SOCKET_CHANNELS.DISCONNECT, () => {
        console.log('Disconnected from product: ', currentProductId);
      });
    });
  }

  private raiseBet(raisedBet: number) {
    const data: RaiseBetData = {
      productId: this.productData.id,
      raisedBet,
    };

    this.requestsService.raiseBet(data).subscribe({
      next: (response: Response<RaiseBetResponse>) => {
        this.userService.userData = response.data.userData;
        this.socket.emit(SOCKET_CHANNELS.RAISE_BET, response.data.product);
        this.toastrService.info(TOASTR_MESSAGES.SUCCESS_RAISED_BET);
      },
      error: ({ error }) => {
        this.toastrService.info(error.data.message);
      },
    });
  }
}
