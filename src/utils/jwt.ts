import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const generateAccessToken = (payload: object) =>
  jwt.sign(payload, config.jwtKey, { expiresIn: "7d" });

export const generateRefreshToken = (payload: object) =>
  jwt.sign(payload, config.refreshKey, { expiresIn: "7d" });
