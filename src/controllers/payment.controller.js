import {
  PaymentIntentService,
} from "../services/payment.service.js";

const paymentIntent = async (req, res) => {
  res.send({status:"success", payload:result});
};

export { paymentIntent };
