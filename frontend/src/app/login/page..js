"use client";

import { useState, useEffect } from "react";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for session cookies
        body: JSON.stringify(formData),
      });
      const text = await res.text();
      setMessage(text);
    } catch (err) {
      setMessage("Login failed");
      console.error(err);
    }
  };

  useEffect(() => {
    // Ensure that any dynamic logic or date formatting happens only on the client
    // This can help avoid mismatches between SSR and client rendering
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Log In</button>
      </form>
      <p>
        New here?{" "}
        <Link href="/register">
          Create an account
        </Link>
      </p>
      <p>{message}</p>
    </div>
  );
}
