import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReview } from "../controllers/reviewController.js";

const reviewRouters=express.Router();

reviewRouters.post('/:productId',isLoggedIn,createReview)


export default reviewRouters;