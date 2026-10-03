import { Request, Response } from "express";
import { logger } from "@/utils";
import {
  completeRegistration,
  startRegistration,
  normalizeEmail,
  EmailTakenError,
  validateEmail,
} from "./signup.service";

export const startSignup = async (req: Request, res: Response) => {
  const { email, registrationRequest } = req.body;
  logger.info("Auth", "signup-starting")

  if (!email || !registrationRequest) {
    return res.status(400).json({
      status: "error",
      message: "email and registrationRequest are required.",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email format.",
    });
  }

  try {
    const { registrationResponse } = startRegistration({ email, registrationRequest });
    return res.status(200).json({ status: "success", registrationResponse });
  } catch (error) {
    logger.error("Auth/start-signup", "Failed to start registration", error);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const finishSignup = async (req: Request, res: Response) => {
  const { email, registrationRecord } = req.body;
  logger.info("Auth", "signup-finishing")

  if (!email || !registrationRecord) {
    return res.status(400).json({
      status: "error",
      message: "email and registrationRecord are required.",
    });
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const result = completeRegistration({
      email: normalizedEmail,
      registrationRecord,
    });

    return res.status(201).json({
      status: "success",
      ...result,
      user: { email: normalizedEmail },
    });
  } catch (error) {
    if (error instanceof EmailTakenError) {
      return res.status(409).json({ status: "error", message: "Email already registered." });
    }
    logger.error("Auth/finish-signup", "Failed to complete registration", error);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};