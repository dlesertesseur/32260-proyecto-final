import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import sendMail from "./mail.service.js";
import { nanoid } from "nanoid/non-secure";

const repository = new CartRepository();

const getAllCards = async () => {
  const ret = await repository.getAll();
  return ret;
};

const findCardById = async (id) => {
  const ret = await repository.findById(id);
  return ret;
};

const insertCart = async (cart) => {
  const ret = await repository.create(cart);
  return ret;
};

const updateCart = async (id, body) => {
  const ret = await repository.update(id, body);
  return ret;
};

const removeCart = async (cid) => {
  const ret = await repository.remove(cid);
  return ret;
};

const addProductToCard = async (owner, cid, pid, quantity) => {
  const productRepository = new ProductRepository();
  let product = await productRepository.findById(pid);
  if (owner !== product.owner) {
    const ret = await repository.addProduct(cid, pid, quantity);;
    return ret;
  } else {
    const error = new Error(
      `Premium user cannot add their own products to the cart`
    );
    error.statusCode = 401;
    throw error;
  }
};

const removeProductCart = async (cid, pid) => {
  const ret = await repository.removeProduct(cid, pid);
  return ret;
};

const updateProductCart = async (cid, pid, body) => {
  const ret = await repository.updateProduct(cid, pid, body);
  return ret;
};

const purchaseItems = async (user, cid) => {
  const productsToPurchase = [];
  const productsWithoutStock = [];
  const productRepository = new ProductRepository();
  const ticketRepository = new TicketRepository();

  let amount = 0;
  const cart = await repository.findById(cid);
  const productsInCart = cart.products;

  //Check product stock.
  productsInCart.forEach((productInCart) => {
    if (productInCart.product.stock >= productInCart.quantity) {
      productsToPurchase.push(productInCart);
    } else {
      productsWithoutStock.push(productInCart.product.id);
    }
  });

  //Process
  for (let i = 0; i < productsToPurchase.length; i++) {
    const productInCart = productsToPurchase[i];

    //Calculate ticket amount
    amount += productInCart.product.price * productInCart.quantity;

    //Remove product from cart and update stock.
    await repository.removeProduct(cid, productInCart.product.id);

    //Update stock
    productInCart.product.stock =
      productInCart.product.stock - productInCart.quantity;
    await productRepository.update(
      productInCart.product.id,
      productInCart.product
    );
  }

  //Create ticket.
  const payload = {
    code: nanoid(),
    amount: amount,
    purchaser: user.email,
  };
  const ticket = await ticketRepository.create(payload);

  //const ret = { ticket: ticket, productsWithoutStock: productsWithoutStock };
  const ret = productsWithoutStock;

  const subject = `TICKET CODE:${ticket.code}`;
  const body = `<h2>TICKET CODE : ${ticket.code}</h2> <h3>FECHA:${ticket.purchase_datetime} <h3> <h3>TOTAL: $ ${ticket.amount} <h3>`;
  
  await sendMail(ticket.purchaser, subject, body);

  return ret;
};

export {
  getAllCards,
  findCardById,
  insertCart,
  updateCart,
  removeCart,
  addProductToCard,
  updateProductCart,
  removeProductCart,
  purchaseItems,
};
