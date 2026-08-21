import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Pega o token sem o "Bearer"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Adiciona os dados do usuário decodificados ao objeto req
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ error: "Forbidden: Invalid or expired token" });
  }
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
