import UserDao from "../persistence/nomgoDb/user.dao.js";

const daos = {
  fileSystem: null,
  mongoose: UserDao,
};

class UserDaoFactory {
  static create(daoKey) {
    return new daos[daoKey]();
  }
}

export default UserDaoFactory;
