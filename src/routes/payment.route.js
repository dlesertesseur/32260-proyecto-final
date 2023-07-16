import { paymentIntent } from "../controllers/payment.controller.js";
import { Router } from "express";

const paymentRoute = Router();

paymentRoute.post(
  "/payment-intent",
  passport.authenticate("current", { session: false }),
  paymentIntent
);

export default paymentRoute;
