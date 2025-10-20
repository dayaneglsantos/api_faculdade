import { db } from "../config/db.js";

const User = {
  async create(user) {
    const query = `INSERT INTO users (name, email,password) VALUES (?, ?, ?)`;
    const values = [user.name, user.email, user.password];
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...user };
  },

  async getAll() {
    const query = `SELECT * FROM users`;
    const [result] = await db.query(query);
    return result;
  },

  async getById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    const usersWithoutPassword = result.map(({ password, ...user }) => user);
    return usersWithoutPassword[0];
  },

  async getByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [result] = await db.query(query, [email]);
    return result[0];
  },

  async update(id, name, email, password) {
    const query = `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`;
    const values = [name, email, password, id];
    const [result] = await db.query(query, values);
    return result;
  },

  async partialUpdate(id, updatedFields) {
    const query = `UPDATE users SET ? WHERE id = ?`;
    const [result] = await db.query(query, [updatedFields, id]);
    return result;
  },

  async delete(id) {
    const query = `Delete FROM users WHERE id = ? LIMIT 1`;
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  },
};

export default User;
