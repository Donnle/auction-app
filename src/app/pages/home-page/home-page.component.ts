import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RequestsService } from '../../services/requests.service';
import { Pagination, Product, ProductsResponse, Response } from '../../interfaces';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  pagination: Pagination;
  searchText: string;

  page: number = 1;
  count: number = 8;

  @AutoUnsubscribe() loadProductsSubscription: Subscription;

  loadProducts: (query?: string) => void;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private requestsService: RequestsService,
  ) {
  }

  ngOnInit() {
    this.loadProducts = this.storeSearchData();

    this.loadProducts();
    this.document.body.classList.add('home-page');

    this.loadProductsSubscription = fromEvent(window.document, 'scroll').pipe(debounceTime(1500)).subscribe({
      next: () => {
        this.loadProducts();
      },
    });
  }

  onSubmit() {
    this.resetProductData();
    this.loadProducts(this.searchText);
  }

  storeSearchData(): (query?: string) => void {
    const searchData: string[] = [''];

    return (query?: string) => {
      if (this.page > this.pagination?.countPages) {
        return;
      }

      if (query) {
        searchData.push(query);
      }

      const lastSearchText = searchData[searchData.length - 1];

      this.requestsService.getProducts(this.page, this.count, lastSearchText).subscribe({
        next: ({ data, success }: Response<ProductsResponse>) => {
          if (success) {
            if (data.pagination.countProducts > this.page) {
              this.products.push(...data.products);
              this.pagination = data.pagination;
              this.page += 1;
            }
          }
        },
      });
    };
  }

  resetProductData() {
    this.products = [];
    this.page = 1;
  }

  ngOnDestroy() {
    this.document.body.classList.remove('home-page');
  }
}
