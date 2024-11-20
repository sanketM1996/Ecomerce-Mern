import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createOrder, getAllOrder, getOrderById, getOrderStatsCtrl, updateOrder } from "../controllers/orderController.js";
import isAdmin from "../middlewares/isAdmin.js";

const orderRoutes=express.Router();

orderRoutes.post('/',isLoggedIn,createOrder)
orderRoutes.get('/',isLoggedIn,getAllOrder)
orderRoutes.get('/:id',isLoggedIn,getOrderById)
orderRoutes.put('/update/:id',isLoggedIn,updateOrder)
orderRoutes.get('/sales/sum',isLoggedIn,isAdmin,getOrderStatsCtrl)






export default orderRoutes;