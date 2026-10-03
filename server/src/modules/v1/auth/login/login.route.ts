import { Router } from "express";
import { startSignin, finishSignin } from "./login.controller";
import { methodNotAllowedHandler } from "@/middlewares";

import { routeRegistry } from "@/docs";

const router = Router();
// Register route schema with auto-generated docs
routeRegistry.register({
  method: "POST",
  path: "/api/v1/auth/login",
  handler: startSignin,
  docs: {
    tags: ["Auth"],
    summary: "Login endpoint",
    description: "Handles user login requests.",
    responses: {
      "200": {
        description: "Successful login response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "success" },
                message: {
                  type: "string",
                  example: "Auth/login module is running successfully.",
                },
              },
              required: ["status", "message"],
            },
          },
        },
      },
      "500": {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "error" },
                message: { type: "string", example: "Internal Server Error" },
              },
              required: ["status", "message"],
            },
          },
        },
      },
    },
  },
});

router.use(methodNotAllowedHandler(["POST"]));
router.post("/login/start", startSignin);
router.post("/login/finish", finishSignin);

export default router;
