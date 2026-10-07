# Internship REST API

A REST API for managing internship records using Node.js, Express and SQLite.

## Features

- Create internship
- View all internships
- View internship by ID
- Update internship
- Delete internship
- Input validation
- Pagination
- SQLite persistence

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /internships | List internships with pagination |
| GET | /internships/:id | Get one internship |
| POST | /internships | Create internship |
| PUT | /internships/:id | Update internship |
| DELETE | /internships/:id | Delete internship |

## Example Request

POST `/internships`

```json
{
  "title": "Full Stack Developer Intern",
  "company": "Edvyro",
  "domain": "Web Development"
}
