import express from "express";
import { login, register } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";


const authRouter = express.Router();


authRouter.post("/registration",register);
authRouter.post("/login", login);

authRouter.get("/all-user",authMiddleware,roleMiddleware(["admin","manager"]))


export default authRouter;
