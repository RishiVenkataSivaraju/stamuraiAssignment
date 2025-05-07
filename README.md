# 🗂️ Task Management System

A full-stack **Task Management System** built with the **MERN stack (MongoDB, Express.js, React, Node.js)** that supports user authentication, task CRUD operations, team collaboration, dashboards, and search/filter functionality.

---

## 🚀 Features

### ✅ User Authentication
- Secure registration and login.
- Passwords stored securely using hashing.
- Session/token-based authentication.

### ✅ Task Management
- Full CRUD operations.
- Each task has:
  - Title
  - Description
  - Due Date
  - Priority (High, Medium, Low)
  - Status (Pending, In-progress, Completed)

### ✅ Team Collaboration
- Assign tasks to other registered users.
- Notify users when assigned a task.

### ✅ Dashboard
- See tasks assigned to you.
- See tasks created by you.
- View overdue tasks.

### ✅ Search & Filter
- Search by title or description.
- Filter by:
  - Status
  - Priority
  - Due Dates (before, after)
  - Overdue status

---

## 🧠 How We Executed the Project

### 📌 Backend:
- Node.js with Express for API.
- MongoDB with Mongoose for schema modeling.
- API endpoints for auth, task management, and search.
- Middleware for session/authentication check.
- Task assignment and basic notification logic.

### 🎨 Frontend:
- Built with React and TailwindCSS.
- Components:
  - **AuthForm** – Login/Register.
  - **TaskForm** – Create and update tasks.
  - **TaskCard** – Display each task.
  - **Dashboard** – Group tasks by categories.
  - **SearchBar** – Dynamic search and filters.
- Fetch or Axios for API calls.
- Organized state for user and task data.

---

## 🔧 Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) or use [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- npm or yarn

---

## ⚙️ Backend Setup

```bash
cd backend
npm install

