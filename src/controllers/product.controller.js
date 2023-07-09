import config from "../config/config.js";
import CustomError from "../services/errors/CustomError.js";
import { EErrors } from "../services/errors/enums.js";
import { generateProductErrorInfo } from "../services/errors/errorInfo.js";
import {
  getAllProducts,
  findProductById,
  insertProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";
import { findByEmail } from "../services/user.service.js";
import { z } from "zod";

const getAll = async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const sort = req.query.sort;
  const query = req.query.query;

  try {
    const data = await getAllProducts(limit, page, sort, query);
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getProductsList = async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const sort = req.query.sort;
  const query = req.query.query;

  try {
    const data = await getAllProducts(limit, page, sort, query);
    const user = await findByEmail(req.user.email);
    const role = user.role === config.USER_ROLE ? config.PREMIUM_ROLE : config.USER_ROLE;
    const params = { data: data, user: user, changeRole: role.toLocaleUpperCase() };

    res.render("products", {
      title: "Products",
      style: "index.css",
      params,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findById = async (req, res) => {
  const pid = req.params.pid;

  try {
    const product = await findProductById(pid);
    req.logger.debug("findProductById -> " + pid);
    if (product) {
      res.send(product);
    } else {
      res
        .status(404)
        .send({ message: "product with id " + pid + " not found " });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const insert = async (req, res, next) => {
  try {

    /*Validation definitions*/
    const validate = z.object({
      title: z.string(),
      description: z.string(),
      code: z.string(),
      price: z.number(),
      status: z.string(),
      stock: z.number(),
      category: z.string(),
      thumbnail: z.string().array(),
      //owner: z.string().optional(),
    });

    /*Evaluate payload*/
    const payload = validate.safeParse(req.body);
    if (payload.success) {

      if(req.user.role === config.PREMIUM_ROLE) {
        payload.data.owner = req.user.email;
      }

      const product = await insertProduct(payload.data);
      res.send(product);
    } else {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo(req.body),
        message: "Error traing to create product",
        code: EErrors.INVALID_TYPE_ERROR,
      });
    }
  } catch (error) {
    next(error);
  }
};

const determinateOwner = (req) => {
  const owner = req.user.role === config.ADMIN_ROLE ? config.ADMIN_ROLE : req.user.email;
  return(owner);
}

const update = async (req, res) => {
  const pid = req.params.pid;
  const owner = determinateOwner(req);
  if (pid) {
    try {
      const product = await updateProduct(owner, pid, req.body);
      res.send(product);
    } catch (error) {
      res.status(error?.statusCode ? error.statusCode : 500).send({ message: error.message });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

const remove = async (req, res) => {
  const pid = req.params.pid;
  const owner = determinateOwner(req);
  if (pid) {
    try {
      const product = await deleteProduct(owner, pid);
      res.send(product);
    } catch (error) {
      res.status(error?.statusCode ? error.statusCode : 500).send({ message: error.message });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

export { getAll, findById, update, insert, remove, getProductsList };
