import asyncHandler from "express-async-handler";
import Color from "../models/Color.js";

export const createColor = asyncHandler(async (req, res) => {
    const { name } = req.body
    const colorFind = await Color.findOne({ name })
    if (colorFind) {
        throw new Error('color exist')
    }
    const color = await Color.create({
        name:name.toLowerCase(),
        user: req.userAuthId
    });
    res.json({
        status: 'success',
        message: "Color created successfully",
        color
    })
})

export const getAllColor = asyncHandler(async (req, res) => {
    const colors = await Color.find()
    res.json({
        status: 'success',
        message: "color fetched successfully",
        colors
    })
})

export const getSingleColor = asyncHandler(async (req, res) => {
    const color = await Color.findById(req.params.id)
    res.json({
        status: 'success',
        message: "color fetched successfully",
        color
    })
})

// get update category
export const updateColor = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const color = await Color.findByIdAndUpdate(req.params.id, {
        name,
    }, { new: true, runValidators: true })
    res.json({
        status: 'success',
        message: "color updated successfully",
        color
    })
})

// delete category
export const deleteColor = asyncHandler(async (req, res) => {
    const deleteColor = await Color.findByIdAndDelete(req.params.id);
    res.json({
        status: 'success',
        message: "color deleted successfully",
    })
})