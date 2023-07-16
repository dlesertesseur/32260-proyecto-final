 import config from "../config/config.js";
 import Stripe from "stripe"

class PaymentIntentService {
  constructor() {
     this.stripe = new Stripe(config.STRIPE_API_KEY);
  }

  createPaymentIntent = async(data) => {
    const paymentIntent = await this.stripe.paymentIntents.create(data);
    return(paymentIntent)
  }
}
export { PaymentIntentService };
