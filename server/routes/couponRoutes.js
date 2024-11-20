import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCoupon, deleteCoupon, getAllCoupon, getCouponById, updateCoupon } from "../controllers/couponController.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponRoutes=express.Router();

couponRoutes.post('/',isLoggedIn,isAdmin,createCoupon)
couponRoutes.get('/',isLoggedIn,getAllCoupon)
couponRoutes.get('/:id',isLoggedIn,getCouponById)
couponRoutes.put('/:id',isLoggedIn,isAdmin,updateCoupon)
couponRoutes.delete('/:id',isLoggedIn,isAdmin,deleteCoupon)






export default couponRoutes;
