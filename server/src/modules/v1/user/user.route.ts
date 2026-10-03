import { Router } from "express";
import { getAllUsers, getOneUser } from "./user.controller";
import { methodNotAllowedHandler, requireAuth } from "@/middlewares";

import { routeRegistry } from "@/docs";

const router = Router();
// Register route schema with auto-generated docs
routeRegistry.register({
  method: "GET",
  path: "/api/v1/user",
  handler: getAllUsers,
  docs: {
    tags: ["User"],
    summary: "Get all users",
    description: "Retrieves a list of all users.",
    security: [{ cookieAuth: [] }],
    responses: {
      "200": {
        description: "Successful response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "success" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "1" },
                      name: { type: "string", example: "John Doe" },
                      email: { type: "string", example: "john.doe@example.com" },
                    },
                    required: ["id", "name", "email"],
                  },
                },
              },
              required: ["status", "data"],
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

routeRegistry.register({
  method: "GET",
  path: "/api/v1/user/me",
  handler: getOneUser,
  docs: {
    tags: ["User"],
    summary: "Get current user",
    description: "Returns the logged-in user, identified by the opaque-sid cookie.",
    security: [{ cookieAuth: [] }],
    responses: {
      "200": {
        description: "Current user",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "success" },
                data: {
                  type: "object",
                  properties: {
                    id: { type: "number", example: 1 },
                    email: { type: "string", example: "john.doe@example.com" },
                  },
                  required: ["id", "email"],
                },
              },
              required: ["status", "data"],
            },
          },
        },
      },
      "401": { description: "Missing, invalid, or expired session cookie" },
      "404": { description: "User not found" },
      "500": { description: "Internal server error" },
    },
  },
});

router.use(methodNotAllowedHandler(["GET"]));
router.get("/", requireAuth, getAllUsers);
router.get("/me", requireAuth, getOneUser);

export default router;
