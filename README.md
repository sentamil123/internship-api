# Internship Portal - Full Stack Capstone

A full-stack internship portal built using Node.js, Express.js, SQLite, HTML, CSS and JavaScript.

This project combines internship management, application handling, validation, pagination, security controls, health monitoring and request logging into one application.

## Live API

**Production URL:**

https://internship-api-dyk6.onrender.com

**Health Check:**

https://internship-api-dyk6.onrender.com/health

## Technology Stack

- Node.js
- Express.js
- SQLite
- HTML5
- CSS3
- JavaScript
- REST API
- Render

## Features

### Internship Management

- Create internship
- View all internships
- View internship by ID
- Update internship
- Delete internship
- Pagination support

### Application Management

- Submit internship applications
- Validate applicant details
- Verify internship existence
- Store application information in SQLite

### Security

- Secure HTTP headers
- Request rate limiting
- Input validation
- Proper HTTP status codes
- Centralized error handling

### Monitoring

- Health check endpoint
- Request logging
- Response status logging
- Request duration logging
- Timestamp logging

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| GET | `/health` | Health check |
| GET | `/internships` | List internships |
| GET | `/internships/:id` | Get internship by ID |
| POST | `/internships` | Create internship |
| PUT | `/internships/:id` | Update internship |
| DELETE | `/internships/:id` | Delete internship |
| POST | `/applications` | Submit application |

## Pagination

The internship listing supports pagination.

Example:

```text
/internships?page=1&limit=10
