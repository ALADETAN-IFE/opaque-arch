import { Router } from "express";
import { signupRoutes } from "./signup";
import { loginRoutes } from "./login";

const router = Router();

router.use("/", signupRoutes);
router.use("/", loginRoutes);

export default router;
