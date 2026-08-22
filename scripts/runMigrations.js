import { readFile } from "node:fs/promises";
import { db } from "../src/config/db.js";

const migrations = [
  "001_create_users.sql",
  "002_create_courses.sql",
  "003_create_user_courses.sql",
];

try {
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      // Aguarda o banco estar pronto para receber conexões
      await db.query("SELECT 1");
      break;
    } catch (error) {
      if (attempt === 10) throw error;

      console.log("Aguardando o banco iniciar...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

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
