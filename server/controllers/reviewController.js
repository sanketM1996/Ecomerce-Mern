import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const createReview=asyncHandler(async(req,res)=>{
    const {product,message,rating}=req.body
   const {productId}=req.params;
   const productFound=await Product.findById(productId).populate('reviews');
   if(!productFound){
    throw new Error("product not fornd")
   }
//    check already reviews
   const hasReviwe=productFound?.reviews?.find((review)=>{
    return review?.user?.toString() === req?.userAuthId?.toString()
   })
   if(hasReviwe){
    throw new Error("you allready reviewd the product")
   }
   const review=await Review.create({
    message,
    rating,
    product:productFound?._id,
    user:req.userAuthId
   });
   productFound.reviews.push(review._id)
   await productFound.save();
   res.status(201).json({
    success:true,
    message:"Review Created successfully"
   })
})

