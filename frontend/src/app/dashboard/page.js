"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "todo",
    assignee: "",
  });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUsers();
    fetchTasks();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/users", { credentials: "include" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8080/tasks", { credentials: "include" });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setMessage("Failed to load tasks");
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:8080/notifications", { credentials: "include" });
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          priority: "low",
          status: "todo",
          assignee: "",
        });
        setMessage("Task created successfully!");
        await fetchTasks();
        await fetchNotifications();
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
      assignee: task.assignee || "",
    });
    setMessage("");
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        await fetchNotifications();
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

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>Task Dashboard</h1>

      {/* Notification Bell */}
      <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            padding: "0.25rem 0.5rem",
            fontSize: "12px",
          }}
        >
          {unreadCount}
        </span>
        <button onClick={() => fetchNotifications()}>🔔 Notifications</button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((n) => (
            <li key={n._id} onClick={() => markAsRead(n._id)} style={{ cursor: "pointer" }}>
              {n.message} <em>({new Date(n.createdAt).toLocaleString()})</em>
            </li>
          ))}
        </ul>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: "2rem" }}>
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
        <select name="assignee" value={formData.assignee} onChange={handleInputChange}>
          <option value="">— Assign to —</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>{u.username}</option>
          ))}
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
                  <select name="assignee" value={editForm.assignee} onChange={handleEditChange}>
                    <option value="">— Assign to —</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>{u.username}</option>
                    ))}
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
                  <p>Assigned to: {users.find(u => u._id === task.assignee)?.username || "Unassigned"}</p>
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



