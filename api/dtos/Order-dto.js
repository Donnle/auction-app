module.exports = class OrderDto {
  id;
  buyerId;
  sellerId;
  productId;
  deliveryAddress;

  constructor(model) {
    this.id = model._id;
    this.buyerId = model.buyerId;
    this.sellerId = model.sellerId;
    this.productId = model.productId;
    this.deliveryAddress = model.deliveryAddress;
  }
};
