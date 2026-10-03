import { Request, Response } from "express";
import { logger } from "@/utils";

export const login = async (_: Request, res: Response) => {
  logger.info("Auth/login", "healthy");

  try {
    res.status(200).json({status: "success", message: "Auth/login module is running successfully."});
  } catch (error) {
    logger.error("Auth/login", "Error occurred while checking health", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
