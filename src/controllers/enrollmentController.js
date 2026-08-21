import Enrollment from "../models/enrollmentModel.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

export const createEnrollment = async (req, res) => {
  const { userId, courseId } = req.params;
  const user = await User.getById(userId);
  const course = await Course.getById(courseId);

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  if (user.role !== "student") {
    return res
      .status(400)
      .json({ message: "Somente alunos podem ser matriculados" });
  }

  if (!course) {
    return res.status(404).json({ message: "Curso não encontrado" });
  }

  const enrollment = await Enrollment.create(userId, courseId);
  return res.status(201).json(enrollment);
};

export const getUserCourses = async (req, res) => {
  const user = await User.getById(req.params.userId);

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const courses = await Enrollment.getCoursesByUser(req.params.userId);
  return res.status(200).json(courses);
};

export const getCurrentUserCourses = async (req, res) => {
  // Consulta os cursos do usuário identificado pelo token
  const courses = await Enrollment.getCoursesByUser(req.user.userId);
  return res.status(200).json(courses);
};

export const deleteEnrollment = async (req, res) => {
  const { userId, courseId } = req.params;
  const deleted = await Enrollment.delete(userId, courseId);

  if (!deleted) {
    return res.status(404).json({ message: "Matrícula não encontrada" });
  }

  return res.status(204).send();
};
