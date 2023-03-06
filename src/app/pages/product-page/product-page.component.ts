import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { ToastrService } from 'ngx-toastr';
import { MODALS, TOASTR_MESSAGES } from '../../enums';
import { ButtonData, Product, ProductsResponse, Response, TimeLeft } from '../../interfaces';
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
  timeLeft: TimeLeft;
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
  timerUpdateInterval: Subscription;
  isLoggedIn: boolean = false;

  @AutoUnsubscribe() isLoggedInSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private requestsService: RequestsService,
    private ngxSmartModalService: NgxSmartModalService,
    private toastrService: ToastrService,
    public productService: ProductService,
  ) {
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

  ngOnInit() {
    this.getRecommendationProducts();

    this.route.params.subscribe({
      next: (params: Params) => {
        const productId = params['productId'];
        this.productService.configureProductPage(productId);
      },
    });

    this.productService.productData$.subscribe({
      next: (productData: Product) => {
        this.productData = productData;

        if (this.timerUpdateInterval) {
          this.timerUpdateInterval.unsubscribe();
        }

        this.timeLeft = this.refreshTimeLeft(this.productData.endDate);
        this.timerUpdateInterval = interval(1000).subscribe(() => {
          this.timeLeft = this.refreshTimeLeft(this.productData.endDate);
          console.log(`Залишилось ${this.timeLeft.daysLeft} днів, ${this.timeLeft.hoursLeft} годин, ${this.timeLeft.minutesLeft} хвилин та ${this.timeLeft.secondsLeft} секунд`);
        });
      },
    });

    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe({
      next: (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      },
    });
  }

  openBuyNow() {
    if (!this.isLoggedIn) {
      this.toastrService.info(TOASTR_MESSAGES.NEEDS_LOGIN_FOR_BUY);
      return;
    }
    this.ngxSmartModalService.create(MODALS.BUY_NOW, BuyNowPopupComponent).open();
  }

  openRaiseBet() {
    this.ngxSmartModalService.create(MODALS.RAISE_BET, RaiseBetPopupComponent).open();
  }

  ngOnDestroy() {
    this.productService.disconnectSocket();
  }

  private refreshTimeLeft(endDate: Date) {
    const targetDate = new Date(endDate);
    const diff = targetDate.getTime() - Date.now();

    return {
      daysLeft: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hoursLeft: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutesLeft: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      secondsLeft: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }
}
