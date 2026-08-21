import { beforeEach, describe, expect, test, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../src/models/userModel.js";
import { hashPassword } from "../src/services/hashPassword.js";
import { app } from "../src/app.js";

// Evita o acesso ao banco durante os testes
vi.mock("../src/models/userModel.js", () => ({
  default: {
    create: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    getByIdWithPassword: vi.fn(),
    getByEmail: vi.fn(),
    partialUpdate: vi.fn(),
    countAdmins: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../src/services/hashPassword.js", () => ({
  hashPassword: vi.fn(),
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

describe("User tests", () => {
  const admin = {
    id: 1,
    name: "Administrador",
    email: "admin@email.com",
    password: "hashed-password",
    role: "admin",
  };

  const student = {
    id: 2,
    name: "Aluno",
    email: "aluno@email.com",
    password: "hashed-password",
    role: "student",
  };

  const adminToken = jwt.sign(
    { userId: admin.id, role: admin.role },
    process.env.JWT_SECRET,
  );
  const studentToken = jwt.sign(
    { userId: student.id, role: student.role },
    process.env.JWT_SECRET,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    User.getById.mockResolvedValue(admin);
    hashPassword.mockResolvedValue("hashed-password");
  });

  test("prevents a student from creating users", async () => {
    User.getById.mockResolvedValue(student);

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        name: "Novo aluno",
        email: "novo@email.com",
        password: "senha123",
      });

    expect(response.status).toBe(403);
  });

  test("allows an admin to create a student", async () => {
    const newStudent = {
      id: 3,
      name: "Novo aluno",
      email: "novo@email.com",
      role: "student",
    };
    User.getByEmail
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(newStudent);

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: newStudent.name,
        email: newStudent.email,
        password: "senha123",
      });

    expect(response.status).toBe(201);
    expect(response.body.role).toBe("student");
  });

  test("requires name, email and password when creating a user", async () => {
    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  test("returns the authenticated user", async () => {
    const response = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(admin.email);
  });

  test("rejects an empty partial update", async () => {
    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  test("updates the user phone", async () => {
    const updatedAdmin = { ...admin, phone: "11999999999" };
    User.getById
      .mockResolvedValueOnce(admin)
      .mockResolvedValueOnce(admin)
      .mockResolvedValueOnce(updatedAdmin);

    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ phone: updatedAdmin.phone });

    expect(response.status).toBe(200);
    expect(response.body.phone).toBe(updatedAdmin.phone);
  });

  test("rejects account deletion when password is invalid", async () => {
    User.getByIdWithPassword.mockResolvedValue(admin);
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .delete("/users/me")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ password: "senha-incorreta" });

    expect(response.status).toBe(401);
  });

  test("deletes the student account when password is valid", async () => {
    User.getById.mockResolvedValue(student);
    User.getByIdWithPassword.mockResolvedValue(student);
    bcrypt.compare.mockResolvedValue(true);

    const response = await request(app)
      .delete("/users/me")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ password: "senha123" });

    expect(response.status).toBe(204);
    expect(User.delete).toHaveBeenCalledWith(student.id);
  });
});
