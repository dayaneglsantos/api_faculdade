import { db } from "../config/db.js";

const Course = {
  async create(course) {
    const query = `INSERT INTO courses (name, code, description) VALUES (?, ?, ?)`;
    const values = [course.name, course.code, course.description || null];
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...course };
  },

  async getAll() {
    const query = `SELECT * FROM courses`;
    const [result] = await db.query(query);
    return result;
  },

  async getById(id) {
    const query = `SELECT * FROM courses WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result[0];
  },

  async update(id, updatedFields) {
    const query = `UPDATE courses SET ? WHERE id = ?`;
    const [result] = await db.query(query, [updatedFields, id]);
    return result;
  },

  // Faz a contagem de estudantes matriculados em um curso específico
  async countStudents(id) {
    const query = `SELECT COUNT(*) AS total FROM user_courses WHERE course_id = ?`;
    const [result] = await db.query(query, [id]);
    return result[0].total;
  },

  async delete(id) {
    const query = `DELETE FROM courses WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  },
};

export default Course;
