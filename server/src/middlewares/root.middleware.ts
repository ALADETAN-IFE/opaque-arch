import { Request, Response } from "express";

export const rootHandler = (_req: Request, res: Response) => {
  res.json({
    name: "server",
    type: "monolith",
    version: "1.0.0",
    status: "running",
    endpoints: {
      root: "/",
      health: "/api/v1/health",
      docs: "/api-docs",
      auth: {
        signup: "/api/v1/auth/signup",
      },
    },
  });
};
