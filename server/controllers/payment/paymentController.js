import { createRequire } from "module";
const require = createRequire(import.meta.url);
const stripe = require("stripe")(
  "sk_test_51LHgg4SBvtfXDvrapj3aVd4yB6t1ZLjuuOKNugb5ZdZv26RFlrf6yhYcOJTMEYsZeZ5tEoUkYdgW4bYictMcw9w200hf3L4rrh"
);

// const stripe = require("stripe")(process.env.STRIPE_SECERET_KEY);
import { AsyncError } from "../../middleware/AsyncError.js";
import ErroHandler from "../../utility/errorHandlerClass.js";

export const paymentController = AsyncError(async (req, res, next) => {
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

export const sendStripeApiKey = AsyncError(async (req, res) => {
  console.log(process.env.STRIPE_API_KEY);
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
