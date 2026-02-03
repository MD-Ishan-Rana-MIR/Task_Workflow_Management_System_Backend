import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { allTask, changeTaskStage, createTask } from "../controllers/task.controller";

const taskRoute = Router();

// Create a new task (Admin / Manager only)
taskRoute.post("/create-task", authMiddleware, roleMiddleware(["admin", "manager"]), createTask);

// Update stage
taskRoute.put("/task-stage-change/:id/stage", authMiddleware,roleMiddleware(["admin", "manager"]) ,changeTaskStage);
taskRoute.get("/all-task", authMiddleware,roleMiddleware(["admin", "manager"]),allTask );

export default taskRoute;
