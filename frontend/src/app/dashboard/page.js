"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "todo",
  });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8080/tasks", {
        credentials: "include",
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setMessage("Failed to load tasks");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: "", description: "", dueDate: "", priority: "low", status: "todo" });
        setMessage("Task created successfully!");
        await fetchTasks();
      } else {
        const { error } = await res.json();
        setMessage(`Failed to create task: ${error}`);
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setMessage("Error creating task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.slice(0, 10),
      priority: task.priority,
      status: task.status,
    });
    setMessage("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setMessage("Task updated successfully!");
        setEditingId(null);
        await fetchTasks();
      } else {
        const { error } = await res.json();
        setMessage(`Failed to update task: ${error}`);
      }
    } catch (err) {
      console.error("Error updating task:", err);
      setMessage("Error updating task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMessage("Task deleted");
        await fetchTasks();
      } else {
        setMessage("Failed to delete task");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Error deleting task");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Task Dashboard</h1>

      <form onSubmit={handleCreateTask} style={{ marginBottom: "1rem" }}>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
        <br />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
        <br />
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required />
        <br />
        <select name="priority" value={formData.priority} onChange={handleInputChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <br />
        <select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <br />
        <button type="submit">Create Task</button>
      </form>

      {message && <p>{message}</p>}

      <h2>My Tasks</h2>
      <ul>
        {tasks.length === 0 ? (
          <li>No tasks found</li>
        ) : (
          tasks.map((task) => (
            <li key={task._id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
              {editingId === task._id ? (
                <>
                  <input name="title" value={editForm.title} onChange={handleEditChange} required />
                  <br />
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} required />
                  <br />
                  <input type="date" name="dueDate" value={editForm.dueDate} onChange={handleEditChange} required />
                  <br />
                  <select name="priority" value={editForm.priority} onChange={handleEditChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <br />
                  <select name="status" value={editForm.status} onChange={handleEditChange}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <br />
                  <button onClick={() => saveEdit(task._id)}>Save</button>
                  <button onClick={cancelEdit} style={{ marginLeft: "0.5rem" }}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{task.title}</strong> — {task.status} ({task.priority})<br />
                  <em>Due: {new Date(task.dueDate).toLocaleDateString()}</em><br />
                  <p>{task.description}</p>
                  <button onClick={() => startEdit(task)}>Edit</button>
                  <button onClick={() => handleDelete(task._id)} style={{ marginLeft: "0.5rem" }}>Delete</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

