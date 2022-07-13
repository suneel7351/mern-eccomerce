import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { AsyncError } from "../../middleware/AsyncError.js";
import ErroHandler from "../../utility/errorHandlerClass.js";
import { config } from "dotenv";
if (process.env.NODE_ENV !== "PRODUCTION") {
  config({ path: "server/.env.local" });
}
const stripe = require("stripe")(process.env.STRIPE_SECERET);

class PaymentController {
  static paymentController = AsyncError(async (req, res, next) => {
    if (!req.body.amount) {
      return next(new ErroHandler("Amount is required.", 400));
    }
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "eccomerce",
      },
    });
    res.status(201).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  });
  static sendStripeApiKey = AsyncError(async (req, res) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
  });
}

export default PaymentController;
