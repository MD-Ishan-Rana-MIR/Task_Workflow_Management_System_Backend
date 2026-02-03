import express from "express";
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "../controllers/project.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const projectRouter = express.Router();

// Admin / Manager access only (middleware can be added later)
projectRouter.post("/create-project", authMiddleware, roleMiddleware(["admin", "manager"]), createProject);
projectRouter.get("/all-project", authMiddleware, roleMiddleware(["admin", "manager"]), getProjects);
projectRouter.get("/single-project/:id", authMiddleware, roleMiddleware(["admin", "manager"]), getProjectById);
projectRouter.patch("/update-project/:id", authMiddleware, roleMiddleware(["admin", "manager"]), updateProject);
projectRouter.delete("/delete-project/:id", authMiddleware, roleMiddleware(["admin", "manager"]), deleteProject);

export default projectRouter;
