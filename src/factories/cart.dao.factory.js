import CartDao from "../persistence/nomgoDb/cart.dao.js"

const daos = {
  fileSystem: null,
  mongoose: CartDao,
};

class CartDaoFactory {
  static create(daoKey) {
    return new daos[daoKey]();
  }
}

export default CartDaoFactory;
