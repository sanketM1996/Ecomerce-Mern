import asyncHandler from "express-async-handler";
import Coupon from "../models/coupon.js";


export const createCoupon=asyncHandler(async(req,res)=>{
    const {code,startDate,endDate,discount}=req.body;
   const couponExist= await Coupon.findOne({
    code,
   });
   if(couponExist){
    throw new Error("coupon  allreadty exist")
   }
   if(isNaN(discount)){
    throw new Error("discount value must be a number")
   }
   const coupon=await Coupon.create({
    code:code?.toUpperCase(),startDate,endDate,discount,user:req.userAuthId
   })
    res.status(201).json({
        status:"success",
        "msg":"create coupen",
        coupon
    })
})

// get all coupon
export const getAllCoupon=asyncHandler(async(req,res)=>{
    const coupons=await Coupon.find();
    res.status(200).json({
        status:"success",
        message:"All Coupons",
        coupons
    })
})
// get single coupen
export const getCouponById=asyncHandler(async(req,res)=>{
    const coupen=await Coupon.findById(req.params.id)
    res.json({
        status:'success',
        message:'coupon fetched',
        coupen
    })
})

// get single coupen
export const updateCoupon=asyncHandler(async(req,res)=>{
    const {code,startDate,endDate,discount}=req.body;
    const coupen=await Coupon.findByIdAndUpdate(req.params.id,{
        code:code?.toUpperCase(),
        discount,
        startDate,
        endDate
    },{
        new:true
    })
    res.json({
        status:'success',
        message:'coupon updated',
        coupen
    })
})

// get single coupen
export const deleteCoupon=asyncHandler(async(req,res)=>{
    const coupen=await Coupon.findByIdAndDelete(req.params.id)
    res.json({
        status:'success',
        message:'coupon deleted',
        coupen
    })
})
