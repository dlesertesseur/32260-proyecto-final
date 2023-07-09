import config from "../config/config.js";
import ProductRepository from "../repositories/product.repository.js";
import sendMail from "./mail.service.js";

const repository = new ProductRepository();

const getAllProducts = async (limit = 10, page = 1, sort, query = null) => {
  let ret = await repository.getAll(limit, page, sort, query);
  return ret;
};

const findProductById = async (id) => {
  let ret = await repository.findById(id);
  return ret;
};

const insertProduct = async (product) => {
  let ret = await repository.create(product);
  return ret;
};

const updateProduct = async (user, pid, body) => {
  let ret = null;
  if (user.role === config.ADMIN_ROLE) {
    ret = await repository.update(pid, body);
    return ret;
  } else {
    let product = await repository.findById(pid);
    if (user.email === product.owner) {
      ret = await repository.update(pid, body);
      return ret;
    } else {
      const error = new Error(
        `The premium user can only modify their products`
      );
      error.statusCode = 401;
      throw error;
    }
  }
};

const deleteProduct = async (user, pid) => {
  let ret = null;
  if (user.role === config.ADMIN_ROLE) {
    ret = await repository.delete(pid);
    return ret;
  } else {
    let product = await repository.findById(pid);
    if (user.email === product.owner) {
      ret = await repository.delete(pid);

      const subject = `Removed product`;
      const body = `</br><h2>Your product ${product.title} code: ${product.code} has been successfully removed</h2>`;
      await sendMail(user.email, subject, body);

      return ret;
    } else {
      const error = new Error(
        `The premium user can only delete their products`
      );
      error.statusCode = 401;
      throw error;
    }
  }
};

export {
  getAllProducts,
  findProductById,
  insertProduct,
  updateProduct,
  deleteProduct,
};
