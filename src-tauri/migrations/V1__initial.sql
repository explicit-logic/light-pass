
CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY NOT NULL,
  "name" VARCHAR(250) NOT NULL UNIQUE,

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS locales (
  quiz_id INTEGER NOT NULL,
  "language" CHAR(2) NOT NULL,
  main BOOLEAN NOT NULL CHECK (main IN (0, 1)) DEFAULT 0,
  "url" TEXT NOT NULL,

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,

  UNIQUE(quiz_id, "language") ON CONFLICT REPLACE,

  FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
);

CREATE TABLE IF NOT EXISTS responders (
  id INTEGER PRIMARY KEY NOT NULL,
  quiz_id INTEGER NOT NULL,

  client_id TEXT NOT NULL,

  email TEXT NOT NULL,
  "name" TEXT,
  "theme" TEXT,
  "group" TEXT,

  "context" TEXT NOT NULL,

  completed BOOLEAN NOT NULL CHECK (completed IN (0, 1)) DEFAULT 0,

  "language" CHAR(2) NOT NULL,
  platform TEXT NOT NULL,
  progress INTEGER NOT NULL,
  timezone TEXT NOT NULL,
  user_agent TEXT NOT NULL,

  connected_at INTEGER NOT NULL,
  finish_at INTEGER NOT NULL,
  start_at INTEGER NOT NULL,

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,

  UNIQUE(quiz_id, email) ON CONFLICT REPLACE,

  FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
);
