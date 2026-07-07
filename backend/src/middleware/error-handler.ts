import type { NextFunction, Request, Response } from "express";

export function errorHandler(error: Error & { status?: number }, _request: Request, response: Response, _next: NextFunction) {
  response.status(error.status ?? 500).json({
    message: error.message || "服务器内部错误"
  });
}
