const fs = require("fs");
const { Cart } = require("../models/Cart");

class CartManager {
  path;
  constructor(path) {
    this.path = path;
  }

  getNextId(ids) {
    let id = null;
    if (ids) {
      if (ids.length > 0) {
        const cart = ids[ids.length - 1];
        id = cart.id + 1;
      } else {
        id = 1;
      }
    }
    return id;
  }

  async addCart(cart) {
    let ret = null;
    const carts = await this.getCarts();

    cart.id = this.getNextId(carts);

    /*Agrega el carrito*/
    try {
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      ret = { cart: cart };
    } catch (error) {
      ret = { message: error, code: 500 };
    }
    return ret;
  }

  async getCarts() {
    let arr = [];
    try {
      const exist = fs.existsSync(this.path);
      if (!exist) {
        await fs.promises.writeFile(this.path, JSON.stringify(arr));
      }
      const ret = await fs.promises.readFile(this.path, "utf-8");
      arr = JSON.parse(ret);
    } catch (error) {
      console.log(error);
    }
    return arr;
  }

  async getCartById(id) {
    let cart = null;
    const carts = await this.getCarts();
    const data = carts?.find((cart) => cart.id === id);

    if (data) {
      cart = new Cart();
      cart.id = data.id;
      cart.products = data.products;
    }

    return cart;
  }

  async saveCart(cart) {
    let ret = null;
    const carts = await this.getCarts();

    /*Toma el indice del objeto*/
    const cartIndex = carts?.findIndex((p) => p.id === cart.id);
    if (cartIndex) {
      const cartFound = carts[cartIndex];

      /*Actualiza los productos*/
      cartFound.products = cart.products;

      try {
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        ret = { cart: cartFound };
      } catch (error) {
        ret = { error: error, code: 500 };
      }
    } else {
      ret = { error: `Cart id:${pid} Not Found`, code: 404 };
    }

    return ret;
  }
}

module.exports = { CartManager };
