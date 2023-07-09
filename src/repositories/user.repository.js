import UserDaoFactory from "../factories/user.dao.factory.js";
import config from "../config/config.js";
import User from "../entities/user.entity.js";
import CartDaoFactory from "../factories/cart.dao.factory.js";
import { samePassword } from "../util/Crypt.js";

class UserRepository {
  constructor() {
    this.dao = UserDaoFactory.create(config.PERSISTENCE);
    this.cartDao = CartDaoFactory.create(config.PERSISTENCE);
  }

  async getAll() {
    const listUserDTO = await this.dao.getAll();
    const users = listUserDTO.map((u) => {
      const user = new User(u);
      return user;
    });

    return users;
  }

  async create(data) {
    const userDto = await this.dao.create(data);
    return new User(userDto);
  }

  async update(id, user) {
    const userDto = await this.dao.update(id, user);
    return new User(userDto);
  }

  async remove(id) {
    await this.dao.remove(id);
  }

  async findById(id) {
    const userDto = await this.dao.findById(id);
    return new User(userDto);
  }

  async findByEmail(email) {
    let user = null;
    const userDto = await this.dao.findByEmail(email);
    if (userDto) {
      user = new User(userDto);
    }
    return user;
  }

  async resetPassword(email, newPassword) {
    const userDto = await this.dao.findByEmail(email);
    if (userDto) {
      if (!samePassword(userDto.password, newPassword)) {
        await this.dao.updatePassword(userDto.id, newPassword);
      } else {
        throw new Error(
          `You must choose a different password than the previous one`
        );
      }
    }
  }

  async changeUserRole(id, role) {
    await this.dao.updateRole(id, role);
  }

  async authenticate(email, password) {
    const userDto = await this.dao.authenticate(email, password);
    return new User(userDto);
  }

  async register(user) {
    const userDto = await this.dao.register(user);
    return new User(userDto);
  }

  async addCartToUser(uid) {
    let userDtoUpdated = null;
    const userDto = await this.dao.findById(uid);
    if (userDto.cart === null) {
      const cartDto = await this.cartDao.create({
        status: "created",
        products: [],
      });
      userDto.cart = cartDto.id;
      userDtoUpdated = await this.dao.update(userDto.id, userDto);
    }
    return userDtoUpdated;
  }

  async updateDocumentsStatus(uid, documentStatus) {
    try {
      const updatedUser = await this.dao.updateDocumentsStatus(
        uid,
        documentStatus
      );
      return updatedUser;
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default UserRepository;
