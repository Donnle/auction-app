import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeadersService {
  accessToken: string;

  userHeaders() {
    return new HttpHeaders().set('authorization', `Bearer ${this.accessToken}`);
  }
}
