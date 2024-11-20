import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
// import { createCategory, deleteCategory, getAllCategory, getSingleCategory, updateCategory } from "../controllers/categoryController.js";
import { createBrand, deleteBrand, getAllBrand, getSingleBrand, updateBrand } from "../controllers/brandController.js";
import isAdmin from "../middlewares/isAdmin.js";

const BrandRoutes=express.Router();

BrandRoutes.post('/',isLoggedIn,isAdmin,createBrand);
BrandRoutes.get('/',getAllBrand);
BrandRoutes.put('/:id',isLoggedIn,isAdmin,updateBrand);
BrandRoutes.get('/:id',getSingleBrand);
BrandRoutes.delete('/:id',isLoggedIn,isAdmin,deleteBrand);






export default BrandRoutes;
