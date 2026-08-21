import { Router } from "express";
import user from "./users.js";
import login from "./login.js";
import course from "./courses.js";
import enrollment from "./enrollments.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Verifica se a API está funcionando
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use(login);
// Todas as rotas abaixo exigem autenticação
router.use(authenticateToken);
router.use(user);
router.use(course);
router.use(enrollment);

export default router;
