import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { errorResponse, successResponse } from "../utils/response";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";



export const register = async (req:Request,res:Response)=>{
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) return res.status(400).json({
            status : "fail",
            msg : "Please enter your name email and password"
        })

        const existeEmail = await User.findOne({email:email});

        if(existeEmail) return errorResponse(res,409,"User email already exists",null);
        const payload = {
            name, email,password
        }

        const data = await User.create(payload);

        return successResponse(res,201,"User registration successfully",{
            name : data?.name,
            email : data?.email,
            role : data?.role,
            createdAt : data?.createdAt
        });
    } catch (error) {
        return errorResponse(res,500,"Something went wrong",error);
    }
};


export const login = async (req:Request, res:Response) => {
  const { email, password } = req.body;

  console.log(email,password)

  try {
const user = await User.findOne({ email});
    console.log(user)
  if (!user) return errorResponse(res,404, "User not found",null);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return errorResponse(res,400,"Invalid creadential",null);

  const accessToken = generateAccessToken({id:user._id,role:user.role});
  const refreshToken = generateRefreshToken({id:user?._id,role:user?.role});

  return successResponse(res,200,"Login successfully",{
    token : accessToken,
    refreshToken : refreshToken,
    role : user?.role
  })

  } catch (error) {

    console.log(error)

    return errorResponse(res,500,"Something went wrong",error);
    
  }



  
};
