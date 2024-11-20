import dotenv from 'dotenv'
dotenv.config();
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import Coupon from '../models/coupon.js';


const strip =new  Stripe(process.env.STRIP_SECRET);
export const createOrder=asyncHandler(async(req,res)=>{
  const {coupon}=req.query;
  if(coupon){
    const foundCoupon=await Coupon.findOne({
      code:code?.toUpperCase(),
    })
    if(foundCoupon?.isExpired){
      throw new Error('Coupon has expire')
    }
    if(!foundCoupon){
      throw new Error('Coupon doesnot exist')
    }
    const discount=foundCoupon?.discount / 100;
  }
// get payload - user orderid shipping address -customer
const { orderItems, shippingAddress: reqShippingAddress, totalPrice } = req.body;
//    find user
const user=await User.findById(req.userAuthId)
// user has shipping addres
let shippingAddress;

if (user.hasShippingAddress) {
  // Use user's existing shipping address if hasShippingAddress is true
  shippingAddress = user.shippingAddress;
} else {
  // If no saved address, use the address provided in the request
  if (!reqShippingAddress) {
    throw new Error("Please provide a shipping address");
  }
  shippingAddress = reqShippingAddress;
}
// check if order is not empty
if(orderItems?.length<=0){
    throw new Error("no order present")
}
// place order -save db
const order=await Order.create({
    user:user?._id,
    orderItems,
    shippingAddress,
    totalPrice:foundCoupon ? totalPrice - totalPrice * discount : totalPrice
});
console.log(order);

// update product quantity
const products = await Product.find({ _id: { $in: orderItems } });

orderItems?.map(async (order) => {
  const product = products?.find((product) => {
    return product?._id?.toString() === order?._id?.toString();
  });
  if (product) {
    product.totalSold += order.qty;
  }
  await product.save();
});
user.orders.push(order?._id);
await user.save()
// actual payment
 //convert order items to have same structure that stripe need
 const convertedOrders = orderItems.map((item) => {
  return {
    price_data: {
      currency: "INR",
      product_data: {
        name: item?.name,
        description: item?.description,
      },
      unit_amount: item?.price * 100,
    },
    quantity: item?.qty,
  };
});
const session = await strip.checkout.sessions.create({
  line_items: convertedOrders,
  metadata: {
    orderId: JSON.stringify(order?._id),
  },
  mode: "payment",
  success_url: "http://localhost:3000/success",
  cancel_url: "http://localhost:3000/cancel",
});
res.send({ url: session.url });
// payment webhok
// update user order
// res.json({
//     success:true,
//     "message":"order palaced",
//     order,
// })
})

// fetch all order
export const getAllOrder=asyncHandler(async(req,res)=>{
 const orders=await Order.find()
 res.json({
  success:true,
  message:"all order",
  orders,
 })
})

// fetch single order
export const getOrderById=asyncHandler(async(req,res)=>{
  const id=req.params.id;
  const order=await Order.findById(id)
  res.status(200).json({
   success:true,
   message:"all order",
   order,
  })
 })

//  update order status
export const updateOrder=asyncHandler(async(req,res)=>{
  const id=req.params.id;
const updatedOrder=await Order.findByIdAndUpdate(id,{
  status:req.body.status
},{
  new:true
});
res.status(200).json({
  success:true,
  message:"order updated successfully",
  updatedOrder,
 })
});

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
