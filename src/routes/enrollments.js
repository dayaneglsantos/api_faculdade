import { Router } from "express";
import {
  createEnrollment,
  getUserCourses,
  getCurrentUserCourses,
  deleteEnrollment,
} from "../controllers/enrollmentController.js";
import { authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// O usuário consulta os próprios cursos
router.get("/users/me/courses", getCurrentUserCourses);

// O administrador gerencia as matrículas
router.get("/users/:userId/courses", authorizeAdmin, getUserCourses);
router.post(
  "/users/:userId/courses/:courseId",
  authorizeAdmin,
  createEnrollment,
);
router.delete(
  "/users/:userId/courses/:courseId",
  authorizeAdmin,
  deleteEnrollment,
);

export default router;
