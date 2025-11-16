import { describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "../src/index.js";

describe("Auth tests", () => {
  test("show error when no auth token is provided", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(401);
  });
  test("invalid token", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", "Bearer invalid_token");
    expect(response.status).toBe(403);
  });
  test("invalid password", async () => {
    const res = await request(app).post("/login").send({
      email: "senha123@teste.com",
      password: "senha1232222",
    });
    expect(res.status).toBe(401);
  });
  test("auth success", async () => {
    const res = await request(app).post("/login").send({
      email: "senha123@teste.com",
      password: "senha123",
    });
    expect(res.status).toBe(200);
  });
  test("auth success", async () => {
    const res = await request(app).post("/login").send({
      email: "senha123@testee.com",
      password: "senha123",
    });
    expect(res.status).toBe(401);
  });
});
