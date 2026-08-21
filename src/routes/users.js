import { Router } from "express";
import {
  createUser,
  getUserById,
  getAllUsers,
  partialUpdateUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  partialUpdateCurrentUser,
  deleteCurrentUser,
} from "../controllers/userController.js";
import { authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Criação de usuário
router.post("/users", authorizeAdmin, createUser);

// Operações do próprio usuário
router.get("/users/me", getCurrentUser);
router.patch("/users/me", partialUpdateCurrentUser);
router.delete("/users/me", deleteCurrentUser);

// Consulta de usuários
router.get("/users", authorizeAdmin, getAllUsers);

// Consulta de usuário por ID
router.get("/users/:id", authorizeAdmin, getUserById);

// Atualização de usuário - PATCH
router.patch("/users/:id", authorizeAdmin, partialUpdateUser);

// Atualização de usuário - PUT
router.put("/users/:id", authorizeAdmin, updateUser);

// Exclusão de usuário
router.delete("/users/:id", authorizeAdmin, deleteUser);

export default router;
