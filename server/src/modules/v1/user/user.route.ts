import { Router } from "express";
import { getAllUsers } from "./user.controller";
import { methodNotAllowedHandler } from "@/middlewares";

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

router.use(methodNotAllowedHandler(["GET"]));
router.get("/", getAllUsers);

export default router;
