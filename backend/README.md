# Inspired Institute Backend

Backend API for the Inspired Institute website and admin panel.

## Overview

The Inspired Institute backend provides REST APIs for the public website and admin panel.

It follows a layered architecture:

```text
Client
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Prisma ORM
  ↓
Neon PostgreSQL
```

Controllers are responsible only for HTTP request/response handling. Business logic, validation coordination, and database operations are handled by services.

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Neon PostgreSQL
* Prisma ORM
* pnpm
* Vitest
* Supertest

---

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── course.controller.js
│   │   ├── enquiry.controller.js
│   │   ├── faculty.controller.js
│   │   ├── gallery.controller.js
│   │   ├── institute.controller.js
│   │   └── result.controller.js
│   ├── lib/
│   │   └── prisma.js
│   ├── middleware/
│   │   └── error.middleware.js
│   ├── routes/
│   │   ├── course.routes.js
│   │   ├── enquiry.routes.js
│   │   ├── faculty.routes.js
│   │   ├── gallery.routes.js
│   │   ├── institute.routes.js
│   │   └── result.routes.js
│   ├── services/
│   │   ├── course.service.js
│   │   ├── enquiry.service.js
│   │   ├── faculty.service.js
│   │   ├── gallery.service.js
│   │   ├── institute.service.js
│   │   └── result.service.js
│   ├── validators/
│   │   ├── course.validator.js
│   │   ├── enquiry.validator.js
│   │   ├── faculty.validator.js
│   │   ├── gallery.validator.js
│   │   ├── institute.validator.js
│   │   └── result.validator.js
│   ├── app.js
│   └── server.js
├── tests/
├── .env.example
├── package.json
└── prisma.config.ts
```

---

## Environment Variables

Create a local `.env` file:

```env
DATABASE_URL="your-neon-database-url"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

Never commit `.env` to Git.

Use `.env.example` as the template for required environment variables.

---

## Installation

Install dependencies:

```bash
pnpm install
```

---

## Database Setup

Validate the Prisma schema:

```bash
pnpm exec prisma validate
```

Generate Prisma Client:

```bash
pnpm exec prisma generate
```

Run database migrations:

```bash
pnpm exec prisma migrate dev
```

The production database is hosted on Neon PostgreSQL.

---

## Development

Start the backend in development mode:

```bash
pnpm dev
```

The development server runs on:

```text
http://localhost:5000
```

Health check:

```text
GET /api/health
```

---

## API Base URL

Development:

```text
http://localhost:5000/api
```

Production:

```text
<production-api-url>/api
```

The production API URL should be configured through environment variables.

---

# API Modules

## Courses

```text
GET    /api/courses
POST   /api/courses
GET    /api/courses/:id
PATCH  /api/courses/:id
DELETE /api/courses/:id
```

Public active courses:

```text
GET /api/courses?public=true
```

---

## Faculty

```text
GET    /api/faculty
POST   /api/faculty
GET    /api/faculty/:id
PATCH  /api/faculty/:id
DELETE /api/faculty/:id
```

---

## Results

```text
GET    /api/results
POST   /api/results
GET    /api/results/:id
PATCH  /api/results/:id
DELETE /api/results/:id
```

---

## Gallery

```text
GET    /api/gallery
POST   /api/gallery
GET    /api/gallery/:id
PATCH  /api/gallery/:id
DELETE /api/gallery/:id
```

---

## Enquiries

Public enquiry submission:

```text
POST /api/enquiries
```

Admin enquiry management:

```text
GET    /api/enquiries
GET    /api/enquiries/:id
PATCH  /api/enquiries/:id/status
DELETE /api/enquiries/:id
```

Supported enquiry statuses:

```text
NEW
CONTACTED
CONVERTED
CLOSED
```

---

## Institute

```text
GET   /api/institute
POST  /api/institute
PATCH /api/institute/:id
```

---

# Response Format

Successful responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

The API avoids exposing internal database errors or sensitive implementation details to clients.

---

# Validation

Each module has its own validator:

```text
src/validators/
```

Validation is performed before database operations.

Invalid requests return an appropriate HTTP `400` response with:

```json
{
  "success": false,
  "message": "Validation error message"
}
```

---

# Error Handling

The backend uses centralized error handling through:

```text
src/middleware/error.middleware.js
```

Routes and controllers pass errors to the centralized middleware instead of duplicating error-handling logic.

The API also handles unknown routes with a `404` response.

---

# Testing

The backend uses:

* Vitest
* Supertest

Run the complete test suite:

```bash
pnpm test
```

The test suite currently covers:

* Health API
* Courses API
* Faculty API
* Results API
* Gallery API
* Enquiries API
* Institute API
* Basic validation failures

---

# NPM Scripts

```bash
pnpm dev
pnpm start
pnpm test
```

### Development

```bash
pnpm dev
```

Starts the backend using Nodemon.

### Production

```bash
pnpm start
```

Starts the backend using Node.js.

### Tests

```bash
pnpm test
```

Runs the complete automated test suite.

---

# Architecture Principles

The backend follows these principles:

1. Routes define API endpoints.
2. Controllers handle HTTP concerns only.
3. Services contain business logic.
4. Prisma handles database access.
5. Validators handle request validation.
6. Centralized middleware handles errors.
7. Environment variables contain secrets and configuration.
8. Public APIs expose only intended public content.
9. Database implementation details are not exposed to clients.
10. The architecture remains ready for future authentication and authorization.

---

# Security Considerations

The backend is designed with production-readiness in mind:

* Database credentials are stored in environment variables.
* `.env` is excluded from Git.
* CORS is configured through environment variables.
* Database errors are not exposed directly to clients.
* Input validation is applied to API requests.
* Prisma is used for parameterized database operations.
* Authentication and admin authorization can be added without restructuring the core architecture.

---

# Database

Database provider:

```text
Neon PostgreSQL
```

ORM:

```text
Prisma
```

Main database entities:

```text
Course
Faculty
Result
Gallery
Enquiry
Institute
```

Prisma migrations are stored under:

```text
prisma/migrations/
```

---

# Deployment

The backend can be deployed to a Node.js-compatible hosting platform.

Required production environment variables:

```env
DATABASE_URL="production-neon-database-url"
PORT="production-port"
FRONTEND_URL="production-frontend-url"
```

Before deployment:

```bash
pnpm install
pnpm exec prisma validate
pnpm exec prisma generate
pnpm test
pnpm start
```

Production database migrations should be applied using the appropriate Prisma deployment workflow.

---

# Future-Ready Areas

The architecture is intentionally prepared for future additions such as:

* Admin authentication
* Role-based authorization
* Protected admin APIs
* Media/file storage integration
* Pagination and filtering
* API rate limiting
* Request logging
* API documentation
* Production monitoring

These features should be introduced only when required by the project scope.

---

# Project Status

The current backend includes:

* REST API architecture
* PostgreSQL database integration
* Neon database
* Prisma ORM
* CRUD APIs
* Public content APIs
* Enquiry management
* Request validation
* Centralized error handling
* Automated API tests
* Development and production scripts
* Environment-based configuration

---

## License

Private project for Inspired Institute.
