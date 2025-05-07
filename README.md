# 🗂️ Task Management System

A full-stack **Task Management System** built with **MERN stack (MongoDB, Express.js, React, Node.js)** that supports user authentication, task CRUD operations, team collaboration, dashboards, and search/filter functionality.

## 🚀 Features

### ✅ User Authentication
- User registration and login.
- Secure password storage with hashing (e.g., bcrypt).
- Session or token-based authentication.

### ✅ Task Management
- Create, Read, Update, Delete (CRUD) operations.
- Each task includes:
  - `Title`
  - `Description`
  - `Due Date`
  - `Priority` (High, Medium, Low)
  - `Status` (Pending, In-progress, Completed)

### ✅ Team Collaboration
- Assign tasks to other registered users.
- Notify users when a task is assigned to them.

### ✅ Dashboard
- View tasks assigned to you.
- View tasks you created.
- View overdue tasks.

### ✅ Search & Filtering
- Search tasks by title or description.
- Filter tasks based on:
  - Status
  - Priority
  - Due Date (before, after, overdue)

---

## 🧠 How We Executed the Project

1. **Backend:**
   - Node.js with Express was used to set up the REST API.
   - MongoDB with Mongoose was used for database modeling.
   - Routes were created for user authentication (`/register`, `/login`) and task operations (`/tasks`, `/tasks/:id`, `/tasks/search`).
   - Task assignment updates the task with `assignedTo` field and triggers notifications (console/email-based).
   - Middleware checks user sessions/authentication for protected routes.

2. **Frontend:**
   - Built with React.js and TailwindCSS.
   - Components:
     - **Login/Register**: For user authentication.
     - **TaskForm**: Create and edit tasks.
     - **TaskCard**: Displays individual task details.
     - **Dashboard**: Categorized view of tasks.
     - **SearchBar**: Implements filters and live search.
   - Axios or `fetch` is used for API calls.
   - Proper state management and conditional rendering for user roles and views.

---

## 🛠️ Getting Started

### 📦 Prerequisites
Make sure you have the following installed:
- Node.js & npm
- MongoDB (local or MongoDB Atlas)

---

## ⚙️ Backend Setup

```bash
cd backend
npm install

