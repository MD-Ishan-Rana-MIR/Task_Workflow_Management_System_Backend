import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "../models/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, config.jwtKey) as { id: string; role?: string };

    console.log(decoded)

    // req.header.role = decoded.role

    // Store as headers (must be strings)

    // req.headers['role'] = String(decoded.role);

    // if (decoded.role) req.headers['id'] = String(decoded.role);
    const user = await User.findById(decoded.id).select("_id role");

    req.headers['role'] = user?.role;
    req.headers.id = user?.id


    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: "Invalid Token" });
  }
};
