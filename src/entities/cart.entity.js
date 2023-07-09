import { ProductInCart } from "./productInCart.entity.js";

class Cart {
  constructor({ id, status, products }) {
    this.id = id.toString();
    this.status = status;
    this.products = products?.map((product) => {
      return new ProductInCart(product);
    });
  }
}

export default Cart;
