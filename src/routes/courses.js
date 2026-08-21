import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Consultas disponíveis para usuários autenticados
router.get("/courses", getAllCourses);
router.get("/courses/:id", getCourseById);

// Alterações disponíveis somente para administradores
router.post("/courses", authorizeAdmin, createCourse);
router.patch("/courses/:id", authorizeAdmin, updateCourse);
router.delete("/courses/:id", authorizeAdmin, deleteCourse);

export default router;
