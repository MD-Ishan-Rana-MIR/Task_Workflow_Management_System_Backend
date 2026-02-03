import { Request, Response } from "express";
import { Workflow } from "../models/workflow.model";
import { errorResponse, successResponse } from "../utils/response";

export const createWorkflow = async (req: Request, res: Response) => {

  const { name, stages, projectId } = req.body;

  console.log(projectId)

  console.log("role is", req.headers.role);

  try {
    const workflow = await Workflow.create({
      projectId,
      name,
      stages: stages.map((s: any, i: number) => ({
        name: s.name,
        order: i + 1
      })),
      createdBy: req.headers.id
    });

    return successResponse(res, 201, "Workflow create successfully", workflow);
  } catch (error) {
    console.log("error is", error)
    return errorResponse(res, 500, "Something went wrong", error)
  }
};

export const getWorkflows = async (_req: Request, res: Response) => {
  try {
    const workflows = await Workflow.find();
    return successResponse(res, 200, "Workflow find successfully", workflows)
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error)
  }
};

export const reorderStages = async (req: Request, res: Response) => {
  try {
    const { stages } = req.body;

    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ message: "Not found" });

    workflow.stages = stages;
    await workflow.save();
    return successResponse(res, 200, "Stage render successfully", workflow);

  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};
