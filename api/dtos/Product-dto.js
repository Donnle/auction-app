module.exports = class ProductDto {
  id;
  title;
  description;
  buyNowPrice;
  currentBet;
  minStep;
  endDate;
  photos;
  currentBetUser;
  sellerId;
  isSold;

  constructor(model) {
    this.id = model._id;
    this.title = model.title;
    this.description = model.description;
    this.buyNowPrice = model.buyNowPrice;
    this.currentBet = model.currentBet;
    this.minStep = model.minStep;
    this.endDate = model.endDate;
    this.photos = model.photos;
    this.currentBetUser = model.currentBetUser;
    this.sellerId = model.sellerId;
    this.isSold = model.isSold;
  }
};
