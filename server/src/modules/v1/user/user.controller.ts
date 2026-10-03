import { logger } from "@/utils";
import { Request, Response } from "express";
import { db } from "@/config";

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const allUser = db.prepare("SELECT * FROM users").all();
    return res.status(200).json({ status: "success", data: allUser });
  } catch (error) {
    logger.error("User/getAllUsers", "Error occurred while fetching all users", error);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
