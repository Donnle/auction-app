import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CityInfo, Department,
  NovaPoshtaResponse,
  ProductResponse,
  ProductsResponse,
  Response,
  UserData, UserDeliveryInfo,
} from '../interfaces';

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

  getAvailableDeliveryAddresses(cityName: string): Observable<NovaPoshtaResponse<CityInfo[]>> {
    return this.http.post<NovaPoshtaResponse<CityInfo[]>>(`https://api.novaposhta.ua/v2.0/json/`, {
      apiKey: '2344a6f87ed19f2b6b7e2cb0a8ed1245',
      modelName: 'Address',
      calledMethod: 'getSettlements',
      methodProperties: {
        FindByString: cityName,
        Page: '1',
        Limit: '20',
      },
    });
  }

  getAvailableDeliveryDepartments(cityName: string): Observable<NovaPoshtaResponse<Department[]>> {
    return this.http.post<NovaPoshtaResponse<Department[]>>(`https://api.novaposhta.ua/v2.0/json/`, {
      apiKey: '2344a6f87ed19f2b6b7e2cb0a8ed1245',
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityName: cityName,
      },
    });
  }

  saveDeliveryAddress(userDeliveryInfo: UserDeliveryInfo): Observable<Response<UserData>> {
    return this.http.put<Response<UserData>>('/api/user/delivery/save-address', userDeliveryInfo);
  }
}
