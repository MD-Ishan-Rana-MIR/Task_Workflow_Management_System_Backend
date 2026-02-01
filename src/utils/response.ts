import { Response } from "express";

export type ApiResponse<T = any> = {
  status: "success" | "error";
  message: string;
  data?: T | null;
  error?: unknown | null;
};

export const successResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  error: unknown = null
): Response<ApiResponse> => {
  return res.status(statusCode).json({
    status: "error",
    message,
    error
  });
};