import express from "express";
import { register } from "../controllers/auth.controller";


const authRouter = express.Router();


authRouter.post("/registration",register);


export default authRouter;
