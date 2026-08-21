import { Router } from "express";
import user from "./users.js";
import login from "./login.js";
import course from "./courses.js";
import enrollment from "./enrollments.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(login);
router.use(authenticateToken);
router.use(user);
router.use(course);
router.use(enrollment);

export default router;
