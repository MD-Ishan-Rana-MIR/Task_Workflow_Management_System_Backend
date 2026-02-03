import express from "express";
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "../controllers/project.controller";

const projectRouter = express.Router();

// Admin / Manager access only (middleware can be added later)
projectRouter.post("/create-project", createProject);
projectRouter.get("/all-project", getProjects);
projectRouter.get("/single-project/:id", getProjectById);
projectRouter.patch("/update-project/:id", updateProject);
projectRouter.delete("/delete-project/:id", deleteProject);

export default projectRouter;
