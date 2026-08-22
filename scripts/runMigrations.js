import { readFile } from "node:fs/promises";
import { db } from "../src/config/db.js";

const migrations = [
  "001_create_users.sql",
  "002_create_courses.sql",
  "003_create_user_courses.sql",
];

try {
  for (const migration of migrations) {
    // Lê e executa cada arquivo na ordem definida
    const file = new URL(`../database/migrations/${migration}`, import.meta.url);
    const sql = await readFile(file, "utf8");

    await db.query(sql);
    console.log(`${migration} executada com sucesso.`);
  }
} catch (error) {
  console.error("Erro ao executar migrations:", error.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
