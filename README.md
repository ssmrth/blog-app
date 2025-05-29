# BlogVerse

BlogVerse is a modern full-stack blogging platform where users can register, log in, and create, read, update, or delete blog posts. The app features a clean, responsive UI built with React and a secure Django REST API backend. Users can explore the latest blogs, write their own, and manage their posts. All actions (register, login, publish, delete, etc.) show beautiful in-app notifications. The backend exposes a RESTful API for authentication and blog management, making it easy to integrate or extend.

---

## Features

- User authentication with JWT
- Create, read, update, and delete blog posts
- Responsive, modern UI with React
- Author-only edit/delete permissions
- Toast notifications for all major actions
- Terms of Use page and protected routes

## Backend API Overview

The Django REST API provides endpoints for user authentication and blog management. All API responses are in JSON.

### Main Endpoints

- `POST /api/signup/` — Register a new user
- `POST /api/login/` — Obtain JWT tokens (login)
- `GET /api/blogs/` — List all blogs (paginated)
- `POST /api/blogs/` — Create a new blog (auth required)
- `GET /api/blogs/{id}/` — Retrieve a single blog by ID
- `PUT /api/blogs/{id}/` — Update a blog (author only)
- `DELETE /api/blogs/{id}/` — Delete a blog (author only)
- `GET /api/my-blogs/` — List blogs by the logged-in user

### Example API Call (Fetch Blogs)

```js
fetch('http://localhost:8000/api/blogs/?page=1')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Authenticated Requests

For endpoints that require authentication, include the JWT access token in the `Authorization` header:

```
Authorization: Bearer <your-access-token>
```

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

- `frontend/`: React application built with Vite
- `backend/`: Django REST API

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
