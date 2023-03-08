import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Pagination, Product, ProductsResponse, Response } from '../../interfaces';
import { RequestsService } from '../../shared/services/requests.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  searchText: string;

  @AutoUnsubscribe() loadProductsSubscription: Subscription;

  private pagination: Pagination;
  private currentPage: number = 1;
  private readonly COUNT_PRODUCTS_ON_PAGE: number = 8;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private requestsService: RequestsService,
  ) {
  }

  ngOnInit() {
    this.document.body.classList.add('home-page');

    this.loadProducts(this.searchText);
    this.loadProductsSubscription = fromEvent(window.document, 'scroll')
      .pipe(debounceTime(1500))
      .subscribe({
        next: () => {
          if (this.currentPage > this.pagination?.countPages && this.products.length > 0) {
            return;
          }
          this.loadProducts(this.searchText);
        },
      });
  }

  onSubmit() {
    this.products = [];
    this.currentPage = 1;
    this.loadProducts(this.searchText);
  }

  loadProducts(query: string = '') {
    this.requestsService.getProducts(this.currentPage, this.COUNT_PRODUCTS_ON_PAGE, query).subscribe({
      next: ({ data }: Response<ProductsResponse>) => {
        this.products.push(...data.products);
        this.pagination = data.pagination;
        this.currentPage += 1;
      },
    });
  }

  ngOnDestroy() {
    this.document.body.classList.remove('home-page');
  }
}
