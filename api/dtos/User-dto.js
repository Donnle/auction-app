module.exports = class UserDtos {
  email;
  id;
  phone;
  name;
  surname;
  balance;
  profileImage;
  deliveryCity;
  deliveryDepartment;
  productsForSale;
  purchasedProducts;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.surname = model.surname;
    this.phone = model.phone;
    this.email = model.email;
    this.balance = model.balance;
    this.profileImage = model.profileImage;
    this.deliveryCity = model.deliveryCity;
    this.deliveryDepartment = model.deliveryDepartment;
    this.productsForSale = model.productsForSale;
    this.purchasedProducts = model.purchasedProducts;
  }
};
