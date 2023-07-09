import ProductDao from "../persistence/nomgoDb/product.dao.js";

const daos = {
  fileSystem: null,
  mongoose: ProductDao,
};

class ProductDaoFactory {
  static create(daoKey) {
    return new daos[daoKey]();
  }
}

export default ProductDaoFactory;
