import CartDto from "./cart.dto.js";

class UserDto {
  constructor({ _id, first_name, last_name, email, age, role, cart, password, documents, last_connection }) {
    this.id = _id;
    this.first_name = first_name;
    this.last_name = last_name,
    this.email = email,
    this.age = age,
    this.role = role,
    this.password = password,
    this.documents = documents ? documents : [],
    this.last_connection = last_connection,
    this.cart = cart ? new CartDto(cart) : null
  }
}

export default UserDto;
