import express from "express";
import { login, register } from "../controllers/auth.controller";


const authRouter = express.Router();


authRouter.post("/registration",register);
authRouter.post("/login", login);


export default authRouter;
