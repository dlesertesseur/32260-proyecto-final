import { ProductInCartDto } from "./productInCart.dto.js";

class CartDto {
  constructor({ _id, status, products }) {
    this.id = _id;
    this.status = status;
    this.products = products?.map((prod) => {
      return new ProductInCartDto(prod);
    });
  }
}

export default CartDto;
