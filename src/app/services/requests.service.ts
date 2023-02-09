import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse, ProductsResponse, Response, UserData } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {

  constructor(private http: HttpClient) {
  }

  getProducts(page: number, count: number, query?: string): Observable<Response<ProductsResponse>> {
    return this.http.post<Response<ProductsResponse>>('/api/market/get-products', {
      page,
      count,
      query,
    });
  }

  getUserData(userId: string): Observable<Response<UserData>> {
    return this.http.get<Response<UserData>>(`/api/user/user-data?id=${userId}`);
  }

  getProductInfo(productId: string): Observable<Response<ProductResponse>> {
    return this.http.post<Response<ProductResponse>>('/api/market/get-product', {
      productId: productId,
    });
  }
}
