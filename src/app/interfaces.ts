export interface Response<T> {
  data: T;
  success: boolean;
}

export interface Login {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

export interface Registration {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

export interface Refresh {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

export interface Logout {
  refreshToken: string;
}

export interface UserData {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: number;
  balance: number;
  profileImage?: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ButtonData {
  text?: string;
  size?: 'small' | 'medium' | 'large' | 'long';
  type?: 'orange' | 'transparent';
}

export interface NormalizeEnd {
  years: string,
  months: string,
  days: string,
  hours: string,
  minutes: string,
  seconds: string,
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  buyNowPrice: number;
  currentBet: number;
  minStep: number;
  endDate: Date;
  photos: string[];
}

export interface Pagination {
  countPages: number;
  countProducts: number;
  currentPage: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductResponse {
  product: Product;
}

export interface BalanceResponse {
  balance: number;
}

export interface RaiseBetData {
  productId: string;
  raisedBet: number;
}

export interface RaiseBetResponse {
  product: Product;
  userData: UserData;
}
