import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { ButtonData, OrderResponse, Product, Response, UserData } from '../../../interfaces';
import { UserService } from '../../../services/user.service';
import { ProductService } from '../../../services/product.service';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-buy-now-popup',
  templateUrl: './buy-now-popup.component.html',
  styleUrls: ['./buy-now-popup.component.scss'],
})
export class BuyNowPopupComponent {
  userData: UserData;
  productData: Product;
  isLoggedIn: boolean;

  buyNowButton: ButtonData = {
    text: 'Купити',
    type: 'orange',
    size: 'medium',
  };

  @AutoUnsubscribe() userDataSubscription: Subscription;
  @AutoUnsubscribe() productDataSubscription: Subscription;

  constructor(private userService: UserService, private productService: ProductService, private requestsService: RequestsService) {
    this.userDataSubscription = this.userService.userData$.subscribe({
      next: (userData: UserData) => {
        this.userData = userData;
      },
    });

    this.productDataSubscription = this.productService.productData$.subscribe({
      next: (productData: Product) => {
        this.productData = productData;
      },
    });
  }

  buyProduct() {
    const productId = this.productData.id;
    const deliveryAddress = `${this.userData.deliveryCity} (${this.userData.deliveryDepartment})`;
    this.requestsService.buyProduct(productId, deliveryAddress).subscribe({
      next: (orderInfo: Response<OrderResponse>) => {
        // redirect to after buy page
        console.log(orderInfo);
      },
      error: (err) => {
        alert(err.error.data.message);
      },
    });
  }
}
