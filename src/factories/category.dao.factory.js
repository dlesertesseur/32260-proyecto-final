import UserDao from "../persistence/nomgoDb/category.dao.js";

const daos = {
  fileSystem: null,
  mongoose: UserDao,
};

class CategoryDaoFactory {
  static create(daoKey) {
    return new daos[daoKey]();
  }
}

export default CategoryDaoFactory;
