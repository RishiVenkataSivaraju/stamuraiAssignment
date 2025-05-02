"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Registering...");

        try {
            const res = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const text = await res.text();
            setMessage(text);
        } catch (err) {
            console.error(err);
            setMessage("Registration failed");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">Register</button>
            </form>
            <p>
                Already a user?{" "}
                <Link href="/login">
                    Log in here
                </Link>
            </p>
            <p>
                New here?{" "}
                <Link href="/register">
                    Create an account
                </Link>
            </p>
        </div>
    );
}

