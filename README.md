# Expense Tracker

A full-stack expense tracking application built with React and Node.js.

## Project Structure

- `backend/` - Node.js/Express API with MongoDB
- `frontend/expense-tracker/` - React frontend with Vite

## Setup

### Backend
```bash
cd backend
npm install
# Create .env file with your MongoDB URI and JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend/expense-tracker
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend folder with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
```

## Features

- User authentication
- Income tracking
- Expense tracking
- Dashboard analytics
