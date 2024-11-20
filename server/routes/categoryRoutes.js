import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCategory, deleteCategory, getAllCategory, getSingleCategory, updateCategory } from "../controllers/categoryController.js";
import catetgoryFileUpload from "../config/categoryUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const categoryRoutes=express.Router();

categoryRoutes.post('/',isLoggedIn,isAdmin,catetgoryFileUpload.single('file'),createCategory);
categoryRoutes.get('/',getAllCategory);
categoryRoutes.put('/:id',isLoggedIn,isAdmin,updateCategory);
categoryRoutes.get('/:id',getSingleCategory);
categoryRoutes.delete('/:id',isLoggedIn,isAdmin,deleteCategory);






export default categoryRoutes;
