export const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  // Trata registros duplicados no banco
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Este registro já existe" });
  }

  // Trata os demais erros da aplicação
  return res.status(500).json({ message: "Erro interno do servidor" });
};
