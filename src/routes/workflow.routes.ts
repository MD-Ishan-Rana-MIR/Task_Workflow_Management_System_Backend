import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { createWorkflow } from "../controllers/workflow.controller";

const workFlowRoute = express.Router();


workFlowRoute.post("/create-workflow", authMiddleware, roleMiddleware(["admin","manager"]),createWorkflow )


export default workFlowRoute;