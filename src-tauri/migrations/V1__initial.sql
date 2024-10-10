
CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY NOT NULL,
  "name" VARCHAR(250) NOT NULL UNIQUE,
  "description" TEXT NOT NULL DEFAULT '',

  "state" INTEGER NOT NULL DEFAULT 0,

  "mode" TEXT NOT NULL DEFAULT 'create',

  "repo" TEXT NOT NULL DEFAULT '',
  "owner" TEXT NOT NULL DEFAULT '',

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS deployment_process (
  quiz_id INTEGER NOT NULL,
  stage TEXT NOT NULL,

  indicator INTEGER NOT NULL DEFAULT 0,

  "order" INTEGER NOT NULL DEFAULT 0,

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,

  UNIQUE(quiz_id, stage, "order") ON CONFLICT REPLACE,

  FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS locales (
  quiz_id INTEGER NOT NULL,
  "language" CHAR(2) NOT NULL,
  main BOOLEAN NOT NULL CHECK (main IN (0, 1)) DEFAULT 0,
  "url" TEXT NOT NULL,

  page_count INTEGER NOT NULL DEFAULT 0,
  question_count INTEGER NOT NULL DEFAULT 0,

  "state" INTEGER NOT NULL DEFAULT 0,

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,

  UNIQUE(quiz_id, "language") ON CONFLICT REPLACE,

  FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS responders (
  id INTEGER PRIMARY KEY NOT NULL,
  quiz_id INTEGER NOT NULL,

  client_id TEXT NOT NULL,

  email TEXT NOT NULL,
  "name" TEXT NOT NULL DEFAULT '',
  "theme" TEXT NOT NULL DEFAULT '',
  "group" TEXT NOT NULL DEFAULT '',

  "context" TEXT NOT NULL DEFAULT '{}',

  completed BOOLEAN NOT NULL CHECK (completed IN (0, 1)) DEFAULT 0,
  identified BOOLEAN NOT NULL CHECK (identified IN (0, 1)) DEFAULT 0,
  verified BOOLEAN NOT NULL CHECK (verified IN (0, 1)) DEFAULT 0,

  "language" CHAR(2) NOT NULL,
  platform TEXT NOT NULL DEFAULT '{}',
  progress INTEGER NOT NULL,
  timezone TEXT NOT NULL,
  user_agent TEXT NOT NULL,

  mark INTEGER NOT NULL CHECK (mark >= 0) DEFAULT 0,

  connected_at INTEGER NOT NULL,
  finished_at INTEGER NOT NULL,
  started_at INTEGER NOT NULL,

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,

  UNIQUE(quiz_id, client_id) ON CONFLICT REPLACE,

  FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY NOT NULL,
  responder_id INTEGER NOT NULL,
  "page" TEXT NOT NULL DEFAULT '',

  answer TEXT NOT NULL DEFAULT '{}',

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,

  UNIQUE(responder_id, "page") ON CONFLICT REPLACE,
  FOREIGN KEY (responder_id) REFERENCES responders (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS page_results (
  id INTEGER PRIMARY KEY NOT NULL,
  responder_id INTEGER NOT NULL,
  "page" TEXT NOT NULL DEFAULT '',

  score INTEGER NOT NULL CHECK (score >= 0) DEFAULT 0,
  threshold INTEGER NOT NULL CHECK (threshold >= 0) DEFAULT 0,
  verified BOOLEAN NOT NULL CHECK (verified IN (0, 1)) DEFAULT 0,

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,

  UNIQUE(responder_id, "page") ON CONFLICT REPLACE,
  FOREIGN KEY (responder_id) REFERENCES responders (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS corrections (
  id INTEGER PRIMARY KEY NOT NULL,
  responder_id INTEGER NOT NULL,
  "page" TEXT NOT NULL DEFAULT '',
  question TEXT NOT NULL DEFAULT '',

  mark INTEGER NOT NULL CHECK (mark >= 0) DEFAULT 0,
  note TEXT NOT NULL DEFAULT '',

  verified BOOLEAN NOT NULL CHECK (verified IN (0, 1)) DEFAULT 0,

  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,

  UNIQUE(responder_id, "page", question) ON CONFLICT REPLACE,
  FOREIGN KEY (responder_id) REFERENCES responders (id) ON DELETE CASCADE
);
