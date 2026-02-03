import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { createWorkflow, getWorkflows } from "../controllers/workflow.controller";

const workFlowRoute = express.Router();


workFlowRoute.post("/create-workflow", authMiddleware, roleMiddleware(["admin", "manager"]), createWorkflow);
workFlowRoute.get("/all-workflow", authMiddleware, roleMiddleware(["admin", "manager"]), getWorkflows);


export default workFlowRoute;