import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const authenticateUser = async (email, password) => {
  const secretKey = process.env.JWT_SECRET;
  const user = await User.getByEmail(email);

  if (!user) {
    return null;
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return null;
  }

  const token = jwt.sign({ userId: user.id }, secretKey, {
    expiresIn: "7d", // token expira em 7 dias
  });

  return token;
};

export default authenticateUser;
