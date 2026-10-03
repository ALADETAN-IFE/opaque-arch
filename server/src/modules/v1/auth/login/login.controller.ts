import { Request, Response } from "express";
import { COOKIE_MAX_AGE_MS, logger } from "@/utils";
import { normalizeEmail, validateEmail } from "../signup/signup.service";
import { completeLogin, LoginError, startLogin } from "./login.service";

export const startSignin = async (req: Request, res: Response) => {
  const { email, startLoginRequest } = req.body;
  logger.info("Auth", "login-starting");

  if (!email || !startLoginRequest) {
    return res.status(400).json({
      status: "error",
      message: "email and startLoginRequest are required.",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email format.",
    });
  }

  try {
    const { loginResponse } = startLogin({ email, startLoginRequest });
    return res.status(200).json({ status: "success", loginResponse });
  } catch (error) {
    logger.error("Auth/login", "Failed to start login", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const finishSignin = async (req: Request, res: Response) => {
  const { email, finishLoginRequest } = req.body;

  logger.info("Auth/login", "login-finishing");
  if (!email || !finishLoginRequest) {
    return res.status(400).json({
      status: "error",
      message: "email and finishLoginRequest are required.",
    });
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const { sessionId } = completeLogin({
      email: normalizedEmail,
      finishLoginRequest,
    });
    res.cookie("opaque-sid", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE_MS,
    });
    return res.status(200).json({
      status: "success",
      user: { email: normalizedEmail },
    });
  } catch (error) {
    if (error instanceof LoginError) {
      return res.status(400).json({ status: "error", message: "No login in progress" });
    }
    logger.error("Auth/login", "Failed to complete login", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
