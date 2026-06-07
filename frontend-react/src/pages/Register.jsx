import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useToast } from "../context/ToastContext";
import apexLogo from "../assets/apex_logo.png";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    async function registerUser(e) {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:5001/api/auth/signup",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, role: "student" })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast(data.error || "Registration failed");
                return;
            }

            toast("Account created! Please log in.", "success");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
            toast("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <img src={apexLogo} alt="APEX" className="auth-logo" />
                    <p className="auth-tagline">Map your path to the top.</p>
                </div>

                <div className="auth-content">
                    <h2 className="auth-title">Create your account</h2>
                    <p className="auth-subtitle">Join APEX to map your path</p>

                    <form className="auth-form" onSubmit={registerUser}>
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="btn-primary auth-btn" type="submit">
                            Register
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
