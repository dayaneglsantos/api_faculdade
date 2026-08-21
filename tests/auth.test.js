import { beforeEach, describe, expect, test, vi } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import User from "../src/models/userModel.js";
import { app } from "../src/app.js";

// Evita o acesso ao banco durante os testes
vi.mock("../src/models/userModel.js", () => ({
  default: {
    getByEmail: vi.fn(),
    getById: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

describe("Auth tests", () => {
  const admin = {
    id: 1,
    name: "Administrador",
    email: "admin@email.com",
    password: "hashed-password",
    role: "admin",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    User.getByEmail.mockResolvedValue(admin);
    User.getById.mockResolvedValue(admin);
  });

  test("returns 401 when no token is provided", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(401);
  });

  test("returns 403 when token is invalid", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(403);
  });

  test("returns 400 when login data is missing", async () => {
    const response = await request(app).post("/login").send({});
    expect(response.status).toBe(400);
  });

  test("returns 400 when email is invalid", async () => {
    const response = await request(app).post("/login").send({
      email: "invalid-email",
      password: "senha123",
    });

    expect(response.status).toBe(400);
  });

  test("returns 401 when password is invalid", async () => {
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app).post("/login").send({
      email: admin.email,
      password: "senha-incorreta",
    });

    expect(response.status).toBe(401);
  });

  test("returns token and user when login succeeds", async () => {
    bcrypt.compare.mockResolvedValue(true);

    const response = await request(app).post("/login").send({
      email: admin.email,
      password: "senha123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.role).toBe("admin");
  });
});
