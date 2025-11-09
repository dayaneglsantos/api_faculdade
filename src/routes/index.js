import { Router } from "express";
import user from "./users.js";
import login from "./login.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(login);
router.use(authenticateToken);
router.use(user);

export default router;
