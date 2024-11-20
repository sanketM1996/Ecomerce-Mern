import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js"

export const isLoggedIn=(req,res,next)=>{
   const token= getTokenFromHeader(req)
   const decodedUser= verifyToken(token);
   if(!decodedUser){
    throw new Error('token expire plese login again')
   }else{
    req.userAuthId=decodedUser?.id;
    next()
   }

}