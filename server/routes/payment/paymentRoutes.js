import express from "express";
import PaymentController from "../../controllers/payment/paymentController.js";
import { Authenticate } from "../../middleware/Authentication.js";
export const router = express.Router();

router
  .route("/process/payment")
  .post(Authenticate, PaymentController.paymentController);
router
  .route("/stripekey")
  .get(Authenticate, PaymentController.sendStripeApiKey);
