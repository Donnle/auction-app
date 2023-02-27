/** MAIN RESPONSE **/
export interface Response<T> {
  data: T;
  success: boolean;
}

export interface NovaPoshtaResponse<T> {
  success: boolean;
  data: T;
  errors: any[];
  warnings: any[];
  info: Info;
  messageCodes: any[];
  errorCodes: any[];
  warningCodes: any[];
  infoCodes: any[];
}


/** AUTHORIZATION **/
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
  deliveryCity?: string;
  deliveryDepartment?: string;
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

/** RESPONSES **/
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

export interface RaiseBetResponse {
  product: Product;
  userData: UserData;
}

export interface OrderResponse {
  id: string,
  sellerId: string,
  productId: string,
}

export interface UserDataResponse {
  user: UserData;
}

/** NOVA POSHTA **/
export interface CityInfo {
  Ref: string;
  SettlementType: string;
  Latitude: string;
  Longitude: string;
  Description: string;
  DescriptionRu: string;
  DescriptionTranslit: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu: string;
  SettlementTypeDescriptionTranslit: string;
  Region: string;
  RegionsDescription: string;
  RegionsDescriptionRu: string;
  RegionsDescriptionTranslit: string;
  Area: string;
  AreaDescription: string;
  AreaDescriptionRu: string;
  AreaDescriptionTranslit: string;
  Index1: string;
  Index2: string;
  IndexCOATSU1: string;
  Delivery1: string;
  Delivery2: string;
  Delivery3: string;
  Delivery4: string;
  Delivery5: string;
  Delivery6: string;
  Delivery7: string;
  SpecialCashCheck: number;
  Warehouse: string;
}

export interface Department {
  SiteKey: string;
  Description: string;
  DescriptionRu: string;
  ShortAddress: string;
  ShortAddressRu: string;
  Phone: string;
  TypeOfWarehouse: string;
  Ref: string;
  Number: string;
  CityRef: string;
  CityDescription: string;
  CityDescriptionRu: string;
  SettlementRef: string;
  SettlementDescription: string;
  SettlementAreaDescription: string;
  SettlementRegionsDescription: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu: string;
  Longitude: string;
  Latitude: string;
  PostFinance: string;
  BicycleParking: string;
  PaymentAccess: string;
  POSTerminal: string;
  InternationalShipping: string;
  SelfServiceWorkplacesCount: string;
  TotalMaxWeightAllowed: string;
  PlaceMaxWeightAllowed: string;
  SendingLimitationsOnDimensions: SendingLimitationsOnDimensions;
  ReceivingLimitationsOnDimensions: ReceivingLimitationsOnDimensions;
  Reception: Reception;
  Delivery: Delivery;
  Schedule: Schedule;
  DistrictCode: string;
  WarehouseStatus: string;
  WarehouseStatusDate: string;
  CategoryOfWarehouse: string;
  Direct: string;
  RegionCity: string;
  WarehouseForAgent: string;
  GeneratorEnabled: string;
  MaxDeclaredCost: string;
  WorkInMobileAwis: string;
  DenyToSelect: string;
  CanGetMoneyTransfer: string;
  OnlyReceivingParcel: string;
  PostMachineType: string;
  PostalCodeUA: string;
  WarehouseIndex: string;
}

export interface Info {
  totalCount: number;
}

export interface SendingLimitationsOnDimensions {
  Width: number;
  Height: number;
  Length: number;
}

export interface ReceivingLimitationsOnDimensions {
  Width: number;
  Height: number;
  Length: number;
}

export interface Reception {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}

export interface Delivery {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}

export interface Schedule {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}

/** OTHER **/
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
  id: string;
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

export interface RaiseBetData {
  productId: string;
  raisedBet: number;
}

export interface UserDeliveryInfo {
  userId: string;
  deliveryCity: string;
  deliveryDepartment: string;
}
