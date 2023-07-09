import passport from "passport";
import {
  getAll,
  findById,
  update,
  insert,
  remove,
  getProductsList
} from "../controllers/product.controller.js";
import { Router } from "express";
import { roleAdminValidation } from "../middlewares/index.js";

const productRoute = Router();

productRoute.get(
  "/",
  passport.authenticate("current", { session: false }),
  getAll
);

productRoute.get(
  "/list",
  passport.authenticate("current", { session: false }),
  getProductsList
);

productRoute.get(
  "/:pid",
  passport.authenticate("current", { session: false }),
  findById
);

productRoute.post(
  "/",
  passport.authenticate("current", { session: false }),
  roleAdminValidation,
  insert
);

productRoute.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  roleAdminValidation,
  update
);

productRoute.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  roleAdminValidation,
  remove
);

export default productRoute;
