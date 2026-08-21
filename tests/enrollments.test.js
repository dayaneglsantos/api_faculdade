import { beforeEach, describe, expect, test, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import User from "../src/models/userModel.js";
import Course from "../src/models/courseModel.js";
import Enrollment from "../src/models/enrollmentModel.js";
import { app } from "../src/app.js";

// Evita o acesso ao banco durante os testes
vi.mock("../src/models/userModel.js", () => ({
  default: {
    getById: vi.fn(),
  },
}));

vi.mock("../src/models/courseModel.js", () => ({
  default: {
    getById: vi.fn(),
  },
}));

vi.mock("../src/models/enrollmentModel.js", () => ({
  default: {
    create: vi.fn(),
    getCoursesByUser: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Enrollment tests", () => {
  const admin = { id: 1, role: "admin" };
  const student = { id: 2, role: "student" };
  const course = { id: 3, name: "Banco de Dados", code: "BD" };

  const adminToken = jwt.sign({ userId: admin.id }, process.env.JWT_SECRET);
  const studentToken = jwt.sign(
    { userId: student.id },
    process.env.JWT_SECRET,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    User.getById.mockResolvedValue(admin);
  });

  test("allows a student to list their courses", async () => {
    User.getById.mockResolvedValue(student);
    Enrollment.getCoursesByUser.mockResolvedValue([course]);

    const response = await request(app)
      .get("/users/me/courses")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("prevents a student from creating an enrollment", async () => {
    User.getById.mockResolvedValue(student);

    const response = await request(app)
      .post("/users/2/courses/3")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(403);
  });

  test("returns 404 when user does not exist", async () => {
    User.getById.mockResolvedValueOnce(admin).mockResolvedValueOnce(null);

    const response = await request(app)
      .post("/users/99/courses/3")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  test("returns 404 when course does not exist", async () => {
    User.getById.mockResolvedValueOnce(admin).mockResolvedValueOnce(student);
    Course.getById.mockResolvedValue(null);

    const response = await request(app)
      .post("/users/2/courses/99")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  test("prevents enrolling an admin in a course", async () => {
    User.getById.mockResolvedValue(admin);

    const response = await request(app)
      .post("/users/1/courses/3")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
  });

  test("allows an admin to enroll a student", async () => {
    User.getById.mockResolvedValueOnce(admin).mockResolvedValueOnce(student);
    Course.getById.mockResolvedValue(course);
    Enrollment.create.mockResolvedValue({ user_id: 2, course_id: 3 });

    const response = await request(app)
      .post("/users/2/courses/3")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(201);
    expect(response.body.course_id).toBe(course.id);
  });

  test("returns 404 when enrollment does not exist", async () => {
    Enrollment.delete.mockResolvedValue(false);

    const response = await request(app)
      .delete("/users/2/courses/3")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  test("allows an admin to remove an enrollment", async () => {
    Enrollment.delete.mockResolvedValue(true);

    const response = await request(app)
      .delete("/users/2/courses/3")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(204);
    expect(Enrollment.delete).toHaveBeenCalledWith("2", "3");
  });
});
