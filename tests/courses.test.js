import { beforeEach, describe, expect, test, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import User from "../src/models/userModel.js";
import Course from "../src/models/courseModel.js";
import { app } from "../src/app.js";

// Evita o acesso ao banco durante os testes
vi.mock("../src/models/userModel.js", () => ({
  default: {
    getById: vi.fn(),
  },
}));

vi.mock("../src/models/courseModel.js", () => ({
  default: {
    create: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    countStudents: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Course tests", () => {
  const admin = { id: 1, role: "admin" };
  const student = { id: 2, role: "student" };
  const course = {
    id: 1,
    name: "Desenvolvimento Web",
    code: "DEV-WEB",
    description: "Fundamentos de desenvolvimento web",
  };

  const adminToken = jwt.sign({ userId: admin.id }, process.env.JWT_SECRET);
  const studentToken = jwt.sign(
    { userId: student.id },
    process.env.JWT_SECRET,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    User.getById.mockResolvedValue(admin);
  });

  test("allows an authenticated user to list courses", async () => {
    User.getById.mockResolvedValue(student);
    Course.getAll.mockResolvedValue([course]);

    const response = await request(app)
      .get("/courses")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("prevents a student from creating courses", async () => {
    User.getById.mockResolvedValue(student);

    const response = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${studentToken}`)
      .send(course);

    expect(response.status).toBe(403);
  });

  test("requires name and code when creating a course", async () => {
    const response = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  test("allows an admin to create a course", async () => {
    Course.create.mockResolvedValue(course);

    const response = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(course);

    expect(response.status).toBe(201);
    expect(response.body.code).toBe(course.code);
  });

  test("returns 404 when course does not exist", async () => {
    Course.getById.mockResolvedValue(null);

    const response = await request(app)
      .get("/courses/99")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  test("rejects an empty course update", async () => {
    Course.getById.mockResolvedValue(course);

    const response = await request(app)
      .patch("/courses/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  test("prevents deleting a course with students", async () => {
    Course.getById.mockResolvedValue(course);
    Course.countStudents.mockResolvedValue(1);

    const response = await request(app)
      .delete("/courses/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(409);
    expect(Course.delete).not.toHaveBeenCalled();
  });

  test("deletes a course without students", async () => {
    Course.getById.mockResolvedValue(course);
    Course.countStudents.mockResolvedValue(0);

    const response = await request(app)
      .delete("/courses/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(204);
    expect(Course.delete).toHaveBeenCalledWith("1");
  });
});
