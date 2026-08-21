import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { db } from "../src/config/db.js";
import { hashPassword } from "../src/services/hashPassword.js";
import validateEmail from "../src/services/validateEmail.js";

// Cria uma interface de leitura de dados do terminal
const question = readline.createInterface({ input, output });

try {
  // Verifica se o primeiro administrador já foi criado
  const [admins] = await db.query(
    "SELECT id FROM users WHERE role = 'admin' LIMIT 1",
  );

  if (admins.length > 0) {
    console.log(
      "Já existe um administrador. Cadastre novos usuários pelo fluxo normal da API.",
    );
  } else {
    const name = await question.question("Nome do administrador: ");
    const email = await question.question("E-mail: ");
    const password = await question.question("Senha: ");

    // Valida os dados informados
    if (!name.trim() || !validateEmail(email) || password.length < 8) {
      console.log(
        "Dados inválidos. Informe nome, e-mail válido e senha com pelo menos 8 caracteres.",
      );
      process.exitCode = 1;
    } else {
      const [users] = await db.query("SELECT id FROM users WHERE email = ?", [
        email,
      ]);

      if (users.length > 0) {
        console.log("Já existe um usuário com este e-mail.");
        process.exitCode = 1;
      } else {
        // Protege a senha antes de salvar
        const hashedPassword = await hashPassword(password);

        await db.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
          [name.trim(), email, hashedPassword],
        );

        console.log("Administrador criado com sucesso.");
      }
    }
  }
} catch (error) {
  console.error("Erro ao criar administrador:", error.message);
  process.exitCode = 1;
} finally {
  question.close();
  await db.end();
}
