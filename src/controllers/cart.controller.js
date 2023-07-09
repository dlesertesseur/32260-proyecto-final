import config from "../config/config.js";
import {
  findCardById,
  getAllCards,
  insertCart,
  updateCart,
  removeCart,
  addProductToCard,
  updateProductCart,
  removeProductCart,
  purchaseItems,
} from "../services/cart.service.js";
import { findUserById } from "../services/user.service.js";

const getCartsList = async (req, res) => {
  try {
    const carts = await getAllCards();
    res.render("carts", {
      title: "Carts",
      style: "index.css",
      carts,
    });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const carts = await getAllCards();
    res.send(carts);
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const insert = async (req, res) => {
  try {
    req.logger.info("cart. controller -> insert user id " + req.user.id);
    const newCart = { ...req.body };
    const cart = await insertCart(newCart);

    const user = await findUserById(req.user.id);
    user.cart = cart;

    res.send(cart);
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await updateCart(cid, req.body);
    res.send(cart);
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const remove = async (req, res) => {
  const cid = req.params.cid;
  if (cid) {
    try {
      const cart = await removeCart(cid);
      res.send(cart);
    } catch (error) {
      req.logger.error(error.message);
      res.status(500).send({ message: error.message });
    }
  } else {
    req.logger.error("Bad request");
    res.status(400).send({ message: "Bad request" });
  }
};

const findById = async (req, res) => {
  const cid = req.params.cid;
  if (cid) {
    try {
      const cart = await findCardById(cid);
      res.render("cart", {
        title: "Cart",
        style: "index.css",
        cart,
      });
    } catch (error) {
      req.logger.error(error.message);
      res.status(500).send({ message: error.message });
    }
  } else {
    req.logger.error("Bad request");
    res.status(400).send({ message: "Bad request" });
  }
};

const determinateOwner = (req) => {
  let owner = null;
  if (req.user.role === config.USER_ROLE) {
    owner = "";
  } else {
    owner =
      req.user.role === config.ADMIN_ROLE ? config.ADMIN_ROLE : req.user.email;
  }
  return owner;
};

const addProduct = async (req, res) => {
  let cart = null;
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.params.quantity ? req.params.quantity : 1;

  if (cid && pid) {
    try {
      const owner = determinateOwner(req);
      cart = await addProductToCard(owner, cid, pid, quantity);
      res.send(cart);
    } catch (error) {
      req.logger.error(error.message);
      res.send({ status: "error", error: error.message });
    }
  } else {
    req.logger.error("Bad request");
    res.status(400).send({ message: "Bad request" });
  }
};

const removeProduct = async (req, res) => {
  let cart = null;
  const cid = req.params.cid;
  const pid = req.params.pid;

  if (cid && pid) {
    try {
      cart = await removeProductCart(cid, pid);
      res.send(cart);
    } catch (error) {
      req.logger.error(error.message);
      res.status(500).send({ message: error.message });
    }
  } else {
    req.logger.error("Bad request");
    res.status(400).send({ message: "Bad request" });
  }
};

const updateProduct = async (req, res) => {
  let cart = null;
  const cid = req.params.cid;
  const pid = req.params.pid;
  const body = req.body;

  if (cid && pid) {
    req.logger.debug("cart.controller -> updateProduct cid:" + cid);
    try {
      cart = await updateProductCart(cid, pid, body);
      res.send(cart);
    } catch (error) {
      req.logger.error(error.message);
      res.status(error.code).send({ message: error.message });
    }
  } else {
    req.logger.error("Bad request");
    res.status(400).send({ message: "Bad request" });
  }
};

const purchase = async (req, res) => {
  const cid = req.params.cid;
  const user = req.user;

  if (cid) {
    try {
      const purchaseData = await purchaseItems(user, cid);
      res.send(purchaseData);
    } catch (error) {
      req.logger.error(error.message);
      res.status(error.code).send({ message: error.message });
    }
  } else {
    req.logger.error("Bad request");
    res.status(400).send({ message: "Bad request" });
  }
};

const getError = (index) => {
  let ret = null;
  switch (index) {
    case "1":
      ret = "Premium user cannot add their own products to the cart";
      break;

    default:
      ret = `Error code ${index} not defined`;
      break;
  }

  return ret;
};
const processError = async (req, res) => {
  const index = req.params.erridx;
  try {
    const errorMessage = getError(index);
    const err = { message: errorMessage };
    res.render("cart-error", err);
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export {
  getAll,
  findById,
  insert,
  update,
  remove,
  addProduct,
  removeProduct,
  updateProduct,
  getCartsList,
  purchase,
  processError,
};
