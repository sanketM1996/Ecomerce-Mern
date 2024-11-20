// @Access private

import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";

export const createProduct=(asyncHandler(async(req,res)=>{
  
try {
    const {name,description,brand,category,sizes,colors,price,totalQty}=req.body;
    const convertedImages=req.files.map((file)=>file?.path)
    console.log(req.files); // Log uploaded files

    // exist porduct
    const productExist=await Product.findOne({name});
    if(productExist){
        throw new Error("Product Allready exist");
    }
    // find category
    const categoryFound=await Category.findOne({name:category});
    if(!categoryFound){
        throw new Error("Category not found or check the name")
    }

 
    // find brand
    const brandFound=await Brand.findOne({name:brand?.toLowerCase()});
    if(!brandFound){
        throw new Error("Brand not found or check the name")
    }
    // create the product
    const product=await Product.create({
        name,description,brand,category,sizes,colors,user:req.userAuthId,price,totalQty,images: convertedImages,
    })
    // pust category to product
    categoryFound.products.push(product._id);
    await categoryFound.save()
    // pust brand to product

    brandFound.products.push(product._id);
    await brandFound.save()
    // product in category
    res.json({
        status:'success',
        message:"Product created successfully",
        product,
        // images:convertedImages
    })
} catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
}
}))

// public
export const getAllProduct=(asyncHandler(async(req,res)=>{
    const products=await Product.find();
    res.json({
        status:'success',
        products
    })
}))

export const getProductByName=(asyncHandler(async(req,res)=>{
    let productQuery= Product.find();
    // search by name
    if(req.query.name){
        productQuery =productQuery.find({
            name:{$regex: req.query.name,$options:'i'}
        })
    }
    // search by brand
    if(req.query.brand){
        productQuery =productQuery.find({
            brand:{$regex: req.query.brand,$options:'i'}
        })
    }
      // search by category
      if(req.query.category){
        productQuery =productQuery.find({
            category:{$regex: req.query.category,$options:'i'}
        })
    }
      // search by colour
      if(req.query.colors){
        productQuery =productQuery.find({
            colors:{$regex: req.query.colors,$options:'i'}
        })
    }
     // search by sizes
     if(req.query.sizes){
        productQuery =productQuery.find({
            sizes:{$regex: req.query.sizes,$options:'i'}
        })
    }
    // filter by range
    if(req.query.price){
        const priceRange=req.query.price.split('-');
        productQuery =productQuery.find({
            price:{$gte:priceRange[0],$lte:priceRange[1]}
        })
    }
    // pagination
    const page=parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    const limit=parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const startIndex= (page-1) * limit;
    const endIndex=page * limit;
    const total=await Product.countDocuments()
    productQuery=productQuery.skip(startIndex).limit(limit);
    const pagination={}
    if(endIndex < total){
        pagination.next={
            page:page+1,
            limit
        };
    }
    if(startIndex > 0){
        pagination.prev={
            page:page-1,
            limit
        };
    }
    const products=await productQuery.populate('reviews');

    res.json({
        status:'success',
        total,
        results:products.length,
        pagination,
        message:"product fatched",
        products
    })
}))

// get single product
export const getSingleProduct=asyncHandler(async(req,res)=>{
    const productById= await Product.findById(req.params.id).populate('reviews');
    if(!productById){
        throw new Error("product not found")
    }
    res.json({
        status:'success',
        message:"product sucess",
        productById
    })
})

// get update product
export const updateProduct=asyncHandler(async(req,res)=>{
    const {name,description,brand,category,sizes,colors,user,price,totalQty}=req.body;
const product=await Product.findByIdAndUpdate(req.params.id,{
    name,description,brand,category,sizes,colors,user,price,totalQty
}, { new: true, runValidators: true })
    res.json({
        status:'success',
        message:"product updated successfully",
        product
    })
})


// delete product
export const deleteProduct=asyncHandler(async(req,res)=>{
    const deleteProduct= await Product.findByIdAndDelete(req.params.id);
    res.json({
        status:'success',
        message:"product deleted successfully",
        deleteProduct
    })
})