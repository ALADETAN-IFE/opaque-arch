import { Router } from "express";
import { startSignup, finishSignup } from "./signup.controller";
import { methodNotAllowedHandler } from "@/middlewares";

import { routeRegistry } from "@/docs";

const router = Router();

routeRegistry.register({
  method: "POST",
  path: "/api/v1/auth/signup/start",
  handler: startSignup,
  docs: {
    tags: ["Auth"],
    summary: "Start signup",
    description: "Initializes the OPAQUE registration flow and returns the server registration response.",
    responses: {
      "200": {
        description: "Successful registration start response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "success" },
                registrationResponse: { type: "string" },
              },
              required: ["status", "registrationResponse"],
            },
          },
        },
      },
      "400": {
        description: "Missing required signup payload",
      },
      "500": {
        description: "Internal server error",
      },
    },
  },
});

routeRegistry.register({
  method: "POST",
  path: "/api/v1/auth/signup/finish",
  handler: finishSignup,
  docs: {
    tags: ["Auth"],
    summary: "Finish signup",
    description: "Stores the completed registration record for a newly signed-up user.",
    responses: {
      "200": {
        description: "Successful registration completion",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "success" },
                ok: { type: "boolean", example: true },
                user: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    email: { type: "string" },
                  },
                },
              },
              required: ["status", "ok", "user"],
            },
          },
        },
      },
      "400": {
        description: "Missing required finish-signup payload",
      },
      "500": {
        description: "Internal server error",
      },
    },
  },
});

router.use(methodNotAllowedHandler(["POST"]));
router.post("/signup/start", startSignup);
router.post("/signup/finish", finishSignup);

export default router;
