import express from "express";
import { createProduct, deleteProduct, getAllProduct, getProductByName, getSingleProduct, updateProduct } from "../controllers/ProductController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const productRoutes=express.Router();

productRoutes.post('/',isLoggedIn,isAdmin,upload.array('files'),createProduct);
productRoutes.get('/',isLoggedIn,getAllProduct);
productRoutes.get('/byname',getProductByName);
productRoutes.get('/:id',getSingleProduct);
productRoutes.put('/:id',isLoggedIn,isAdmin,updateProduct);
productRoutes.delete('/:id',isLoggedIn,isAdmin,deleteProduct);








export default productRoutes;
