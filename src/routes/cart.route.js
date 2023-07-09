import passport from "passport";
import {
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
} from "../controllers/cart.controller.js";
import { Router } from "express";
import { roleUserValidation } from "../middlewares/index.js";

const cartRoute = Router();

cartRoute.get(
  "/",
  passport.authenticate("current", { session: false }),
  getAll
);
cartRoute.get(
  "/list",
  passport.authenticate("current", { session: false }),
  getCartsList
);

cartRoute.get(
  "/:cid",
  passport.authenticate("current", { session: false }),
  findById
);

cartRoute.post(
  "/",
  passport.authenticate("current", { session: false }),
  roleUserValidation,
  insert
);

cartRoute.post(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  roleUserValidation,
  addProduct
);

cartRoute.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  roleUserValidation,
  purchase
);

cartRoute.put(
  "/:cid/",
  passport.authenticate("current", { session: false }),
  roleUserValidation,
  update
);

cartRoute.put(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  roleUserValidation,
  updateProduct
);

cartRoute.delete(
  "/:cid",
  passport.authenticate("current", { session: false }),
  remove
);

cartRoute.delete(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  removeProduct
);

cartRoute.get(
  "/error/:erridx",
  passport.authenticate("current", { session: false }),
  processError
);

export default cartRoute;
