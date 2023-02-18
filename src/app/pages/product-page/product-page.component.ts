import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RequestsService } from '../../services/requests.service';
import { ButtonData, Product, ProductResponse, ProductsResponse, Response } from '../../interfaces';

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
}
