export enum LOCAL_STORAGE {
  USER_DATA = 'userData',
  ACCESS_TOKEN = 'accessToken'
}

export enum MODALS {
  BUY_NOW = 'buy-now',
  LOGIN = 'login',
  REGISTRATION = 'registration',
  RAISE_BET = 'raise-bet'
}

export enum SOCKET_CHANNELS {
  CONNECT = 'connect',
  CHANGE_CURRENT_BET = 'change-current-bet',
  REGISTER_SUBSCRIBER = 'register-subscriber',
  RAISE_BET = 'raise-bet',
  DISCONNECT = 'disconnect',
  ALREADY_SOLD = 'already-sold'
}

export enum TOASTR_MESSAGES {
  SUCCESS_RAISED_BET = 'Ставку успішно піднято!',
  PRODUCT_ALREADY_SOLD = 'Товар вже продано!',
  SOMETHING_WENT_WRONG = 'Щось пішло не так! Оновіть сторінку або зверніться до нас!',
  NO_ENOUGH_MONEY = 'Недостатньо коштів на балансі!',
  NO_ENOUGH_MONEY_BE = 'Недостатньо коштів на балансі! Якщо ви впевнені що це не так, перезавантажте сторінку',
  NEEDS_LOGIN_FOR_RAISE_BET = 'Потрібно ввійти для того щоб підняти ставку!',
  NEEDS_LOGIN_FOR_BUY = 'Потрібно ввійти для того щоб придбати товар!',
}
