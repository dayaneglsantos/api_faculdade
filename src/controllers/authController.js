import User from "../models/userModel.js";
import authenticateUser from "../services/authService.js";
import validateEmail from "../services/validateEmail.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  // Valida os dados antes de autenticar
  if (!email || !password) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Formato de e-mail inválido" });
  }

  try {
    const token = await authenticateUser(email, password);

    if (token) {
      const user = await User.getByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const usersWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return res.status(200).send({ token, ...usersWithoutPassword });
    } else {
      return res.status(401).send({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export default login;
