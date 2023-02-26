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
import { SOCKET_CHANNELS } from '../enums';
import { UserService } from './user.service';

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
  ) {
    this.isLoggedInSubs = this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
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

    if (this.userService.userData.balance < raisedBet) {
      return alert('Недостатньо коштів на балансі, якщо ви впевнені що це не так, перезавантажте сторінку');
    }

    this.requestsService.checkUserBalance().subscribe({
      next: (response: Response<BalanceResponse>) => {
        if (response.data.balance > raisedBet) {
          this.raiseBet(raisedBet);
        } else {
          alert('Недостатньо коштів на балансі, якщо ви впевнені що це не так, перезавантажте сторінку');
        }
      },
      error: () => {
        alert('Щось пішло не так, оновіть сторінку або зверніться до нас');
      },
    });
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

      this.socket.on(SOCKET_CHANNELS.CHANGE_CURRENT_BET, (productData: Response<ProductResponse>) => {
        this.productData = productData.data.product;
        this.userService.refreshUserData();
      });

      this.socket.on(SOCKET_CHANNELS.ALREADY_SOLD, () => {
        alert('Товар вже продано!');
      });

      this.socket.on(SOCKET_CHANNELS.DISCONNECT, () => {
        console.log('Disconnected from product: ', currentProductId);
      });
    });
  }

  disconnectSocket() {
    this.socket.disconnect();
  }

  private raiseBet(raisedBet: number) {
    const data: RaiseBetData = {
      productId: this.productData._id,
      raisedBet,
    };

    this.requestsService.raiseBet(data).subscribe({
      next: (response: Response<RaiseBetResponse>) => {
        this.userService.userData = response.data.userData;
        this.socket.emit(SOCKET_CHANNELS.RAISE_BET, data);
      },
    });
  }
}
