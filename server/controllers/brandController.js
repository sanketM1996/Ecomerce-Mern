import asyncHandler from "express-async-handler";
// import Category from "../models/Category.js";
import Brand from "../models/Brand.js";

export const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body
    const brandFind = await Brand.findOne({ name })
    if (brandFind) {
        throw new Error('brand exist')
    }
    const brand = await Brand.create({
        name:name.toLowerCase(),
        user: req.userAuthId
    });
    res.json({
        status: 'success',
        message: "Brand created successfully",
        brand
    })
})

export const getAllBrand = asyncHandler(async (req, res) => {
    const brands = await Brand.find()
    res.json({
        status: 'success',
        message: "brand fetched successfully",
        brands
    })
})

export const getSingleBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id)
    res.json({
        status: 'success',
        message: "Brand fetched successfully",
        brand
    })
})

// get update category
export const updateBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.id, {
        name,
    }, { new: true, runValidators: true })
    res.json({
        status: 'success',
        message: "brand updated successfully",
        brand
    })
})

// delete category
export const deleteBrand = asyncHandler(async (req, res) => {
    const deleteBrand = await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status: 'success',
        message: "brand deleted successfully",
    })
})