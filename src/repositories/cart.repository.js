import config from "../config/config.js";
import Cart from "../entities/cart.entity.js";
import CartDaoFactory from "../factories/cart.dao.factory.js";

class CartRepository {
  constructor() {
    this.dao = CartDaoFactory.create(config.PERSISTENCE);
  }

  async getAll() {
    const carts = await this.dao.getAll();
    const entities = carts?.map( cart => new Cart(cart));
    return(entities);
  }

  async findById(id) {
    const cart = await this.dao.findById(id);
    const entity = new Cart(cart);
    return(entity);
  }

  async create(payload) {
    const cart = await this.dao.create(payload);
    const entity = new Cart(cart);
    return(entity);
  }

  async update(id, body) {
    const cart = await this.dao.update(id, body);
    const entity = new Cart(cart);
    return(entity);
  }

  async remove(id) {
    await this.dao.remove(id);
  }

  async addProduct(cid, pid, quantity) {
    const cart = await this.dao.addProduct(cid, pid, quantity);
    const entity = new Cart(cart);
    return(entity);
  }

  async updateProduct(cid, pid, body) {
    const cart = await this.dao.updateProduct(cid, pid, body);
    const entity = new Cart(cart);
    return(entity);
  }

  async removeProduct(cid, pid) {
    const cart = await this.dao.removeProduct(cid, pid);
    const entity = new Cart(cart);
    return(entity);
  }
}

export default CartRepository;
