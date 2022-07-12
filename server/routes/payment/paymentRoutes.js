import express from "express";
import {
  paymentController,
  sendStripeApiKey,
} from "../../controllers/payment/paymentController.js";
import { Authenticate } from "../../middleware/Authentication.js";
export const router = express.Router();

router.route("/process/payment").post(Authenticate, paymentController);
router.route("/stripekey").get(Authenticate, sendStripeApiKey);
