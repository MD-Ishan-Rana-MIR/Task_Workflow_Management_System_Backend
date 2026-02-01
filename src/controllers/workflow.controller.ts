import { Request,Response } from "express";
import { Workflow } from "../models/workflow.model";
import { errorResponse, successResponse } from "../utils/response";

export const createWorkflow = async (req:Request, res:Response) => {
  try {
    const workflow = await Workflow.create(req.body);
    return successResponse(res,201,"Workflow create successfully",workflow);
  } catch (error) {
    return errorResponse(res,500,"Something went wrong",error);
  }
  
};
