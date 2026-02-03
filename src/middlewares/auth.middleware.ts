import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const authMiddleware = (
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

    // Store as headers (must be strings)
    req.headers['x-user-id'] = String(decoded.id);
    if (decoded.role) req.headers['x-user-role'] = String(decoded.role);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
