import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod";

export function errorHandling(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const timestamp = new Date().toISOString();

  // AppError (erros previstos)
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
      code: error.code,
      details: error.details,
      path: request.originalUrl,
      timestamp,
    });
  }

  // Erros de validação do Zod
  if (error instanceof ZodError) {
    return response.status(400).json({
      status: "error",
      message: "Validation error",
      code: "VALIDATION_ERROR",
      details: error.flatten(),
      path: request.originalUrl,
      timestamp,
    });
  }

  // Erros inesperados
  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    path: request.originalUrl,
    timestamp,
  });
}
