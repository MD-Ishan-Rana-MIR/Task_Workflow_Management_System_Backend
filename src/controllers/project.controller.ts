import { Request, Response } from "express";
import projectModel from "../models/project.model";

// 1️⃣ Create Project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const project = await projectModel.create({ name, description, members });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 2️⃣ Get all Projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectModel.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 3️⃣ Get single Project
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await projectModel.findById(req.params.id)
      .populate("workflowId")
      .populate("members", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 4️⃣ Update Project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { name, description, workflowId, members } = req.body;

    const project = await projectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.name = name || project.name;
    project.description = description || project.description;
    // project.workflowId = workflowId || project.workflowId;
    project.members = members || project.members;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 5️⃣ Delete Project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await projectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne({ _id: req.params.id });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
