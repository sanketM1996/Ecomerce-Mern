import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler'
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
// @acess Private/Admin
// register user

export const registerUser =asyncHandler(async(req,res)=>{
    const {fullname,password,email} =req.body;
    // check if user exist
    const userExists=await User.findOne({email});
    if(userExists){
         throw new Error("User allready exists")
    }
    // hash password
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    // create user
    const user =await User.create({
        fullname,
        email,
        password:hashedPassword,
    });
    res.status(201).json({
        status:"success",
        message:"user register successfully",
        data:user,
    });
})

// @acess public
// login user

export const loginUser =asyncHandler(async(req,res,next)=>{
     try {
        const {email,password}=req.body
        const userFound=await User.findOne({
            email,
        })
        if(userFound && await bcrypt.compare(password,userFound?.password)){
            res.json({
                status:"success",
                message:"user loged in",
                userFound,token:generateToken(userFound?._id)
            })
        }else{
             throw new Error("invalid login credentials")
        }
     } catch (err) {
        next(err);
    }
     }
);

// @acess private
//  profile user
export const getUserProfile=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.userAuthId).populate('orders')
  console.log(user);
  
    // const token= getTokenFromHeader(req)
    // const verified=verifyToken(token)
    // console.log(verified);
    
    res.json({
        status:'success',
        message:"profile fetch success",user
    })
})

// update shipping Address
export const updateShippingAddres = asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone,
      country,
    } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userAuthId,
      {
        shippingAddress: {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          phone,
          country,
        },
        hasShippingAddress: true,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      message: "User shipping address updated successfully",
      user,
    });
  });