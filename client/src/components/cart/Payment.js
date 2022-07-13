import React, { useEffect, useState, useRef } from "react";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/product/addToCart";
import "./payment.css";
import {
  useStripe,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
} from "@stripe/react-stripe-js";
import Metadata from "../Metadata";
import CheckoutStep from "./CheckoutStep";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { clearError, createOrder } from "../../redux/order/orderSlice";
function Payment() {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.order);
  const { cartItems, shipping } = useSelector((state) => state.cart);
  const payBtn = useRef(null);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const order = {
    shippingInfo: shipping,
    orderItems: cartItems,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharge,
    itemsPrice: orderInfo.subTotal,
    totalPrice: orderInfo.totalPrice,
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;
    try {
      const { data } = await axios.post(
        "/api/v1/process/payment",
        {
          amount: Math.round(orderInfo.totalPrice * 100),
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const client_secret = data.client_secret;
      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shipping.address,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.pinCode,
              country: shipping.country,
            },
          },
        },
      });
      if (result.error) {
        payBtn.current.disabled = false;
        toast.info(result.error.message);
      } else {
        if (result.paymentIntent.status === "processing") {
          setStatus("processing");
        }
        if (result.paymentIntent.status === "succeeded") {
          setStatus("succeeded");
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          await dispatch(createOrder(order));
          await dispatch(clearCart());
          navigate("/payment/success");
        } else {
          toast.error("There's some issue while processing payment ");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);
  return (
    <>
      <Metadata title="Payment" />
      <CheckoutStep activeStep={2} />
      <div className="lg:w-[30%] md:w-[40%] w-[96%] mx-auto p-3 md:p-8">
        <form className="" onSubmit={(e) => submitHandler(e)}>
          <h1 className="text-center text-3xl border-b border-slate-200 pb-2 w-[150px] mx-auto">
            Card Info
          </h1>
          <div className="input-div">
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div className="input-div">
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div className="input-div">
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>
          <Button
            ref={payBtn}
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#fe5f1e" }}
          >
            {status === "processing" ? (
              <CircularProgress style={{ color: "#fff" }} size={18} />
            ) : (
              <>Pay - &#8377;{orderInfo && orderInfo.totalPrice}</>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}

export default Payment;
