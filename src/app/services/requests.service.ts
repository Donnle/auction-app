import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BalanceResponse,
  ProductResponse,
  ProductsResponse,
  RaiseBetData,
  RaiseBetResponse,
  Response,
  UserData,
} from '../interfaces';
import { HeadersService } from './headers.service';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {

  constructor(private http: HttpClient, private headersService: HeadersService) {
  }

  getProducts(page: number, count: number, query?: string): Observable<Response<ProductsResponse>> {
    return this.http.post<Response<ProductsResponse>>('/api/market/get-products', {
      page,
      count,
      query,
    });
  }

  getProductInfo(productId: string): Observable<Response<ProductResponse>> {
    return this.http.post<Response<ProductResponse>>('/api/market/get-product', {
      productId: productId,
    });
  }

  raiseBet(raiseBetData: RaiseBetData): Observable<Response<RaiseBetResponse>> {
    return this.http.put<Response<RaiseBetResponse>>('/api/product/raise-bet', { ...raiseBetData }, {
      headers: this.headersService.userHeaders(),
    });
  }

  checkUserBalance() {
    return this.http.get<Response<BalanceResponse>>('/api/user/user-balance', {
      headers: this.headersService.userHeaders(),
    });
  }

  getUserData() {
    return this.http.get<Response<UserData>>('/api/user/user-data', {
      headers: this.headersService.userHeaders(),
    });
  }
}
