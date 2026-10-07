const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const app = express();
app.use(express.json());

// Secure headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

// Simple rate limiter
const requests = new Map();

app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 60;

  const data = requests.get(ip) || {
    count: 0,
    start: now
  };

  if (now - data.start > windowMs) {
    data.count = 0;
    data.start = now;
  }

  data.count++;
  requests.set(ip, data);

  if (data.count > maxRequests) {
    return res.status(429).json({
      error: "Too many requests. Try again later."
    });
  }

  next();
});

// SQLite database
const db = new DatabaseSync("internships.db");

db.exec(`
CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  domain TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  internship_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Validation
function validateInternship(data) {
  if (!data.title || !data.company || !data.domain) {
    return "title, company and domain are required";
  }

  return null;
}

function validateApplication(data) {
  if (!data.internship_id || !data.name || !data.email) {
    return "internship_id, name and email are required";
  }

  if (!String(data.email).includes("@")) {
    return "valid email is required";
  }

  return null;
}

// GET all internships with pagination
app.get("/internships", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const data = db
    .prepare(
      "SELECT * FROM internships ORDER BY id DESC LIMIT ? OFFSET ?"
    )
    .all(limit, offset);

  const total = db
    .prepare("SELECT COUNT(*) AS count FROM internships")
    .get().count;

  res.json({
    page,
    limit,
    total,
    data
  });
});

// GET internship by ID
app.get("/internships/:id", (req, res) => {
  const item = db
    .prepare("SELECT * FROM internships WHERE id = ?")
    .get(req.params.id);

  if (!item) {
    return res.status(404).json({
      error: "Internship not found"
    });
  }

  res.json(item);
});

// CREATE internship
app.post("/internships", (req, res) => {
  const error = validateInternship(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  const { title, company, domain } = req.body;

  const result = db
    .prepare(
      "INSERT INTO internships (title, company, domain) VALUES (?, ?, ?)"
    )
    .run(title, company, domain);

  res.status(201).json({
    message: "Internship created",
    id: Number(result.lastInsertRowid),
    title,
    company,
    domain
  });
});

// UPDATE internship
app.put("/internships/:id", (req, res) => {
  const error = validateInternship(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  const { title, company, domain } = req.body;

  const result = db
    .prepare(
      "UPDATE internships SET title = ?, company = ?, domain = ? WHERE id = ?"
    )
    .run(title, company, domain, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Internship not found"
    });
  }

  res.json({
    message: "Internship updated",
    id: Number(req.params.id),
    title,
    company,
    domain
  });
});

// DELETE internship
app.delete("/internships/:id", (req, res) => {
  const result = db
    .prepare("DELETE FROM internships WHERE id = ?")
    .run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Internship not found"
    });
  }

  res.json({
    message: "Internship deleted"
  });
});

// APPLICATION FORM
app.post("/applications", (req, res) => {
  const error = validateApplication(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  const { internship_id, name, email } = req.body;

  const internship = db
    .prepare("SELECT id FROM internships WHERE id = ?")
    .get(internship_id);

  if (!internship) {
    return res.status(404).json({
      error: "Internship not found"
    });
  }

  const result = db
    .prepare(
      "INSERT INTO applications (internship_id, name, email) VALUES (?, ?, ?)"
    )
    .run(internship_id, name, email);

  res.status(201).json({
    message: "Application submitted",
    id: Number(result.lastInsertRowid)
  });
});

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Internship API is running"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
