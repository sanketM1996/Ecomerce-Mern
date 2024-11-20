import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body
    const categoryFind = await Category.findOne({ name })
    if (categoryFind) {
        throw new Error('category exist')
    }
    const category = await Category.create({
        name:name.toLowerCase(),
        user: req.userAuthId,
        image:req.file.path
    });
    res.json({
        status: 'success',
        message: "category created successfully",
        category
    })
})

export const getAllCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find()
    res.json({
        status: 'success',
        message: "category fetched successfully",
        categories
    })
})

export const getSingleCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)
    res.json({
        status: 'success',
        message: "category fetched successfully",
        category
    })
})

// get update category
export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name,
    }, { new: true, runValidators: true })
    res.json({
        status: 'success',
        message: "category updated successfully",
        category
    })
})

// delete category
export const deleteCategory = asyncHandler(async (req, res) => {
    const deleteCategory = await Category.findByIdAndDelete(req.params.id);
    res.json({
        status: 'success',
        message: "Category deleted successfully",
    })
})