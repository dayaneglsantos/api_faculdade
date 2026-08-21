import { db } from "../config/db.js";

const Enrollment = {
  async create(userId, courseId) {
    const query = `INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)`;
    await db.query(query, [userId, courseId]);
    return { user_id: Number(userId), course_id: Number(courseId) };
  },

  async getCoursesByUser(userId) {
    const query = `
      SELECT courses.id, courses.name, courses.code, courses.description,
             user_courses.enrolled_at
      FROM user_courses
      INNER JOIN courses ON courses.id = user_courses.course_id
      WHERE user_courses.user_id = ?
    `;
    const [result] = await db.query(query, [userId]);
    return result;
  },

  async delete(userId, courseId) {
    const query = `DELETE FROM user_courses WHERE user_id = ? AND course_id = ?`;
    const [result] = await db.query(query, [userId, courseId]);
    return result.affectedRows > 0;
  },
};

export default Enrollment;
