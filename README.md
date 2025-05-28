# Blog Application

A full-stack blog application built with Django REST Framework and React.

## Features

- User authentication with JWT
- Create, read, update, and delete blog posts
- Responsive design with Tailwind CSS
- Author-only edit/delete permissions

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
