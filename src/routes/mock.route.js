import { Router } from "express";
import { mockingproducts } from "../controllers/mock.controller.js";
import passport from "passport";

const mockRoute = Router();

mockRoute.get(
  "/",
  passport.authenticate("current", { session: false }),
  mockingproducts
);

export default mockRoute;
