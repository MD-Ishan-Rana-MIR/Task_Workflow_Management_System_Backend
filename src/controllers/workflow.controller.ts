import { Request, Response } from "express";
import { Workflow } from "../models/workflow.model";

export const createWorkflow = async (req: Request, res: Response) => {
  const { name, stages } = req.body;

  const workflow = await Workflow.create({
    name,
    stages: stages.map((s: any, i: number) => ({
      name: s.name,
      order: i + 1
    })),
    createdBy: req.headers.id
  });

  res.status(201).json(workflow);
};

export const getWorkflows = async (_req: Request, res: Response) => {
  const workflows = await Workflow.find();
  res.json(workflows);
};

export const reorderStages = async (req: Request, res: Response) => {
  const { stages } = req.body;

  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) return res.status(404).json({ message: "Not found" });

  workflow.stages = stages;
  await workflow.save();

  res.json(workflow);
};
