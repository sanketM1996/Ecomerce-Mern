import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
// import { createCategory, deleteCategory, getAllCategory, getSingleCategory, updateCategory } from "../controllers/categoryController.js";
// import { createBrand, deleteBrand, getAllBrand, getSingleBrand, updateBrand } from "../controllers/brandController.js";
import { createColor, deleteColor, getAllColor, getSingleColor, updateColor } from "../controllers/colorController.js";
import isAdmin from "../middlewares/isAdmin.js";

const ColorRoutes=express.Router();

ColorRoutes.post('/',isLoggedIn,isAdmin,createColor);
ColorRoutes.get('/',getAllColor);
ColorRoutes.put('/:id',isLoggedIn,isAdmin,updateColor);
ColorRoutes.get('/:id',getSingleColor);
ColorRoutes.delete('/:id',isLoggedIn,isAdmin,deleteColor);






export default ColorRoutes;
