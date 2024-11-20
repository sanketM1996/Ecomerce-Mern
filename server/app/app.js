import dotenv from 'dotenv'
dotenv.config();
import Stripe from "stripe";
import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from '../routes/userRoutes.js';
import { globalErrorHnadler,notFound } from '../middlewares/globalErrorHandler.js';
import productRoutes from '../routes/productRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import BrandRoutes from '../routes/BrandRoutes.js';
import ColorRoutes from '../routes/ColorRoutes.js';
import reviewRouters from '../routes/reviewRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import Order from '../models/Order.js';
import couponRoutes from '../routes/couponRoutes.js';
dbConnect();
const app=express();
// incoming data
app.use(express.json());


//Stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIP_SECRET,{
    apiVersion: "2022-11-15",
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  " whsec_021c075d79e9fb3340cb10d25b083aeb37f8b54844c709a2d44646a53d1fdca4";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
    } catch (err) {
      console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      //find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );
      console.log(order);
    } else {
      return;
    }
    // // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntent = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//pass incoming data


// routes
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/brand',BrandRoutes);
app.use('/api/v1/color',ColorRoutes);
app.use('/api/v1/review',reviewRouters);
app.use('/api/v1/order',orderRoutes);
app.use('/api/v1/coupon',couponRoutes);







app.use(notFound)
app.use(globalErrorHnadler)
export default app;