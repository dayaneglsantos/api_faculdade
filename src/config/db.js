import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST, // ex: "localhost"
  user: process.env.DB_USER, // ex: "root"
  password: process.env.DB_PASS, // senha do banco
  database: process.env.DB_NAME, // nome do banco
});
