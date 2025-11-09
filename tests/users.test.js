import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { app } from "../src/index.js";
import request from "supertest";
import * as hashModule from "../src/services/hashPassword.js";

describe("user CRUD", () => {
  let token;
  let newUserId;

  // Executa o login antes de todos os testes para obter o token
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      email: "senha123@teste.com",
      password: "senha123",
    });
    token = res.body.token;
  });

  // Limpa todos os mocks após cada teste
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("create user with existing email", async () => {
    const newUser = {
      name: "John Doe",
      email: "senha123@teste.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send(newUser);

    expect(response.statusCode).toBe(409);
  });
  test("create user with valid data", async () => {
    const newUser = {
      name: "Novo usuário do teste",
      email: `john${Date.now()}@example.com`,
      password: "password123",
    };

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send(newUser);
    console.log(response.body);
    const data = response.body;
    newUserId = data.id;

    expect(data).toHaveProperty("id", expect.any(Number));
    expect(data.name).toBe(newUser.name);
    expect(data.email).toBe(newUser.email);
  });
  test("create user - hash failed", async () => {
    const newUser = {
      name: "New user",
      email: `john${Date.now()}@example.com`,
      password: "password123",
    };
    vi.spyOn(hashModule, "hashPassword").mockResolvedValueOnce(null);

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send(newUser);

    expect(response.status).toBe(500);
  });

  test("get all users", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toBeInstanceOf(Array);
  });

  test("get user by ID", async () => {
    const id = newUserId;
    const response = await request(app)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body.id).toBe(id);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toBeInstanceOf(Object);
  });
  test("get user by ID - user not finded", async () => {
    const id = 1111;
    const response = await request(app)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test("update user using PUT method without send all fields", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      name: "New name",
    };
    const response = await request(app)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(400);
  });

  test("update user using PUT method successfully", async () => {
    const id = newUserId; // Use newUserId if available, otherwise default to 2
    const fieldsToUpdate = {
      name: "New name",
      email: `john${Date.now()}@example.com`,
      password: "newpassword123",
    };
    const response = await request(app)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    const userAfterUpdate = await request(app)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(userAfterUpdate.status).toBe(200);
    expect(userAfterUpdate.body.name).toEqual(fieldsToUpdate.name);
    expect(userAfterUpdate.body.email).toEqual(fieldsToUpdate.email);
    expect(userAfterUpdate.body).not.toHaveProperty("password");
  });

  test("update user using PUT method - user not found", async () => {
    const id = 99999;
    const fieldsToUpdate = {
      name: "New name",
      email: "newemail@example.com",
      password: "newpassword123",
    };
    const response = await request(app)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(404);
  });
  test("update user using PUT method - hash failed", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      name: "New name",
      email: `john${Date.now()}@example.com`,
      password: "newpassword123",
    };
    vi.spyOn(hashModule, "hashPassword").mockResolvedValueOnce(null);

    const response = await request(app)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Erro ao criar hash da senha");
  });

  test("update user using PUT method - sending invalid email", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      name: "teste",
      email: "invalid-email",
      password: "senha1234",
    };
    const response = await request(app)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Formato de e-mail inválido");
  });

  test("update user using PUT method - sending invalid password", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      name: "teste",
      email: "emailvalido@teste.com",
      password: "123",
    };
    const response = await request(app)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Senha deve ter pelo menos 8 caracteres"
    );
  });

  test("update user using PATCH method - change name successfully", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      name: "New name",
    };

    const userBeforeUpdate = await request(app)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .patch(`/users/${id}`)
      .send(fieldsToUpdate)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.name).toBe(fieldsToUpdate.name);
    expect(response.body.email).toBe(userBeforeUpdate.body.email);
  });
  test("update user using PATCH method - change email successfully", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      email: `john${Date.now()}@example.com`,
    };

    const userBeforeUpdate = await request(app)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .patch(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(200);

    expect(response.body.email).toBe(fieldsToUpdate.email);
    expect(response.body.name).toBe(userBeforeUpdate.body.name);
  });
  test("update user using PATCH method - change password successfully", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      password: "newpassword123",
    };

    const userBeforeUpdate = await request(app)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .patch(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(200);

    expect(response.body).not.toHaveProperty("password");
    expect(response.body.name).toBe(userBeforeUpdate.body.name);
  });

  test("update user using PATCH method - user not found", async () => {
    const id = 12211;
    const fieldsToUpdate = {
      name: "New name",
    };

    const response = await request(app)
      .patch(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(404);
  });

  test("update user using PATCH method - hash failed", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      password: "newpassword123",
    };
    vi.spyOn(hashModule, "hashPassword").mockResolvedValueOnce(null);

    const response = await request(app)
      .patch(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(500);
  });

  test("update user using PATCH method - user founded", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      name: "New name",
    };

    const userBeforeUpdate = await request(app)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .patch(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(fieldsToUpdate.name);
    expect(response.body.email).toBe(userBeforeUpdate.body.email);
  });

  test("update user using PATCH method - invalid email", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      email: "invalid-email",
    };

    const response = await request(app)
      .patch(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Formato de e-mail inválido");
  });

  test("update user using PATCH method - sending invalid email", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      email: "invalid-email",
    };

    const response = await request(app)
      .patch(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Formato de e-mail inválido");
  });

  test("update user using PATCH method - sending invalid password", async () => {
    const id = newUserId;
    const fieldsToUpdate = {
      password: "123",
    };

    const response = await request(app)
      .patch(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(fieldsToUpdate);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Senha deve ter pelo menos 8 caracteres"
    );
  });

  test("delete user - not found", async () => {
    const id = 99999;
    const response = await request(app)
      .delete(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test("delete user successfully", async () => {
    const id = newUserId;
    const response = await request(app)
      .delete(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
