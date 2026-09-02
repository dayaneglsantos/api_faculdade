CREATE TABLE IF NOT EXISTS user_courses (
  user_id INT UNSIGNED NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, course_id), -- A combinação identifica a matrícula sem precisar de uma coluna id
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT
);
