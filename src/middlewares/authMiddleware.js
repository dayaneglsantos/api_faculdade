import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Pega o token sem o "Bearer"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Forbidden: Invalid or expired token" });
  }

  // Confirma se o usuário do token ainda existe
  const user = await User.getById(decoded.userId);

  if (!user) {
    return res.status(401).json({ error: "Usuário não encontrado" });
  }

  req.user = { userId: user.id, role: user.role };
  next();
};

export const authorizeAdmin = (req, res, next) => {
  // Permite o acesso somente para administradores
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acesso permitido apenas para administradores" });
  }

  next();
};
