module.exports = class UserDtos {
  email;
  id;
  phone;
  name;
  surname;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.surname = model.surname;
    this.phone = model.phone;
    this.email = model.email;
  }
};
