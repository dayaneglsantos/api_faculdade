import Course from "../models/courseModel.js";

export const createCourse = async (req, res) => {
  const { name, code, description } = req.body;

  if (!name || !code) {
    return res.status(400).json({ message: "Nome e código são obrigatórios" });
  }

  const course = await Course.create({ name, code, description });
  return res.status(201).json(course);
};

export const getAllCourses = async (req, res) => {
  const courses = await Course.getAll();
  return res.status(200).json(courses);
};

export const getCourseById = async (req, res) => {
  const course = await Course.getById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Curso não encontrado" });
  }

  return res.status(200).json(course);
};

export const updateCourse = async (req, res) => {
  const { name, code, description } = req.body;
  const course = await Course.getById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Curso não encontrado" });
  }

  // Adiciona somente os campos enviados
  const updatedFields = {};
  if (name) updatedFields.name = name;
  if (code) updatedFields.code = code;
  if (description !== undefined) updatedFields.description = description || null;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: "Nenhum campo foi enviado" });
  }

  await Course.update(req.params.id, updatedFields);
  const updatedCourse = await Course.getById(req.params.id);
  return res.status(200).json(updatedCourse);
};

export const deleteCourse = async (req, res) => {
  const course = await Course.getById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Curso não encontrado" });
  }

  // Impede a exclusão de cursos com alunos
  if ((await Course.countStudents(req.params.id)) > 0) {
    return res
      .status(409)
      .json({ message: "O curso possui alunos matriculados" });
  }

  await Course.delete(req.params.id);
  return res.status(204).send();
};
