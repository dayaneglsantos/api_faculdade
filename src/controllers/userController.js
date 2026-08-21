import { hashPassword } from "../services/hashPassword.js";
import bcrypt from "bcrypt";
import validateEmail from "../services/validateEmail.js";
import User from "../models/userModel.js";

export const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    birth_date,
    role = "student",
  } = req.body;

  // Valida os campos obrigatórios
  if (!name?.trim() || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nome, e-mail e senha são obrigatórios" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Formato de e-mail inválido" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Senha deve ter pelo menos 8 caracteres" });
  }

  // Aceita somente os perfis disponíveis no sistema
  if (!["admin", "student"].includes(role)) {
    return res.status(400).json({ message: "Perfil de usuário inválido" });
  }

  const existingUser = await User.getByEmail(email);

  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Já existe um usuário com este e-mail" });
  }

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    return res.status(500).send({ message: "Erro ao criar hash da senha" });
  }

  await User.create({
    name: name.trim(),
    email,
    password: hashedPassword,
    phone,
    birth_date,
    role,
  });
  const user = await User.getByEmail(email);
  const usersWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    birth_date: user.birth_date,
    role: user.role,
  };

  res.status(201).json(usersWithoutPassword);
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário" });
  }
};

export const getCurrentUser = async (req, res) => {
  // Busca o usuário identificado pelo token
  req.params.id = req.user.userId;
  return getUserById(req, res);
};

// PUT method
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({
      message: "Todos os campos devem ser enviados (name, email, password)",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).send({ message: "Formato de e-mail inválido" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Senha deve ter pelo menos 8 caracteres" });
  }

  const user = await User.getById(id);

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado" });
  }

  let hashedPassword;
  if (password) {
    hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return res.status(500).send({ message: "Erro ao criar hash da senha" });
    }
  }

  await User.update(id, name, email, hashedPassword);

  res.status(200).send({ id, name, email });
};

// PATCH method
export const partialUpdateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone, birth_date } = req.body;

  const user = await User.getById(id);

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado" });
  }

  const updatedFields = {};
  if (name) updatedFields.name = name;
  if (phone !== undefined) updatedFields.phone = phone || null;
  if (birth_date !== undefined) updatedFields.birth_date = birth_date || null;
  if (email) {
    if (!validateEmail(email)) {
      return res.status(400).send({ message: "Formato de e-mail inválido" });
    }
    updatedFields.email = email;
  }
  if (password) {
    if (password.length < 8) {
      return res
        .status(400)
        .send({ message: "Senha deve ter pelo menos 8 caracteres" });
    }
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return res.status(500).send({ message: "Erro ao criar hash da senha" });
    }
    updatedFields.password = hashedPassword;
  }

  // Impede uma atualização sem campos válidos
  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: "Nenhum campo válido foi enviado" });
  }

  await User.partialUpdate(id, updatedFields);

  const updatedUser = await User.getById(id);
  const usersWithoutPassword = { ...updatedUser };
  delete usersWithoutPassword.password;

  res.status(200).send(usersWithoutPassword);
};

// Atualizações do próprio usuário
export const partialUpdateCurrentUser = async (req, res) => {
  // Usa o ID do token para alterar a própria conta
  req.params.id = req.user.userId;
  return partialUpdateUser(req, res);
};

// Exclusão do próprio usuário
export const deleteCurrentUser = async (req, res) => {
  const user = await User.getByIdWithPassword(req.user.userId);
  const { password } = req.body;

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  if (!password || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Senha inválida" });
  }

  // Mantém pelo menos um administrador no sistema
  if (user.role === "admin" && (await User.countAdmins()) === 1) {
    return res
      .status(409)
      .json({ message: "O último administrador não pode ser excluído" });
  }

  await User.delete(user.id);
  return res.status(204).send();
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (user.role === "admin" && (await User.countAdmins()) === 1) {
      return res
        .status(409)
        .json({ message: "O último administrador não pode ser excluído" });
    }

    await User.delete(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover usuário" });
  }
};
