import { logger } from "@/utils";
import { Request, Response } from "express";
import { allUsers, findUserByEmail } from "./user.service";

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    return res.status(200).json({ status: "success", data: allUsers() });
  } catch (error) {
    logger.error("User/getAllUsers", "Error occurred while fetching all users", error);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const getOneUser = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found." });
    }

    return res.status(200).json({ status: "success", data: user });
  } catch (error) {
    logger.error("User/get-one", "Failed to fetch user", error);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
