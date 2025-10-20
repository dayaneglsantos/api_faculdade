import { hashPassword } from "../services/hashPassword.js";
import validateEmail from "../services/validateEmail.js";
import User from "../models/userModel.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.getByEmail(email);

  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Já existe um usuário com este e-mail" });
  }

  if (!validateEmail(email)) {
    return res.status(400).send({ message: "Formato de e-mail inválido" });
  }

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    return res.status(500).send({ message: "Erro ao criar hash da senha" });
  }

  await User.create({ name, email, password: hashedPassword });
  const user = await User.getByEmail(email);
  const usersWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
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
  const { name, email, password } = req.body;

  const user = await User.getById(id);

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado" });
  }

  const updatedFields = {};
  if (name) updatedFields.name = name;
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

  await User.partialUpdate(id, updatedFields);

  const updatedUser = await User.getById(id);
  const usersWithoutPassword = { ...updatedUser };
  delete usersWithoutPassword.password;

  res.status(200).send(usersWithoutPassword);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await User.delete(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover usuário" });
  }
};
