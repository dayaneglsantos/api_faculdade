import { Router } from "express";
import {
  createUser,
  getUserById,
  getAllUsers,
  partialUpdateUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

// Criação de usuário
router.post("/users", createUser);

// Consulta de usuários
router.get("/users", getAllUsers);

// Consulta de usuário por ID
router.get("/users/:id", getUserById);

// Atualização de usuário - PATCH
router.patch("/users/:id", partialUpdateUser);

// Atualização de usuário - PUT
router.put("/users/:id", updateUser);

// Exclusão de usuário
router.delete("/users/:id", deleteUser);

export default router;
