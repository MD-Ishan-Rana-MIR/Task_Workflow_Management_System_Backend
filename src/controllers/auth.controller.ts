import { Request, Response } from "express";
import { User } from "../models/user.model";
import { errorResponse, successResponse } from "../utils/response";



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