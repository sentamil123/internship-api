const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const app = express();
app.use(express.json());

const db = new DatabaseSync("internships.db");

db.exec(`
CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  domain TEXT NOT NULL
)
`);

function validate(data) {
  if (!data.title || !data.company || !data.domain) {
    return "title, company and domain are required";
  }
  return null;
}

app.get("/internships", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const data = db
    .prepare("SELECT * FROM internships LIMIT ? OFFSET ?")
    .all(limit, offset);

  const total = db
    .prepare("SELECT COUNT(*) AS count FROM internships")
    .get().count;

  res.json({ page, limit, total, data });
});

app.get("/internships/:id", (req, res) => {
  const item = db
    .prepare("SELECT * FROM internships WHERE id = ?")
    .get(req.params.id);

  if (!item) {
    return res.status(404).json({ error: "Internship not found" });
  }

  res.json(item);
});

app.post("/internships", (req, res) => {
  const error = validate(req.body);

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

app.put("/internships/:id", (req, res) => {
  const error = validate(req.body);

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
    return res.status(404).json({ error: "Internship not found" });
  }

  res.json({
    message: "Internship updated",
    id: Number(req.params.id),
    title,
    company,
    domain
  });
});

app.delete("/internships/:id", (req, res) => {
  const result = db
    .prepare("DELETE FROM internships WHERE id = ?")
    .run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Internship not found" });
  }

  res.json({ message: "Internship deleted" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
