import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useToast } from "../context/ToastContext";
import apexLogo from "../assets/apex_logo.png";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    // After Google OAuth, the backend redirects to /login?token=<jwt>.
    // Pull the token out of the URL, store it, then fetch the user (same
    // as App.checkAuth) so the password and Google flows end up identical.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (error) {
            toast("Google sign-in failed. Please try again.");
            window.history.replaceState({}, "", "/login");
            return;
        }
        if (!token) return;

        localStorage.setItem("token", token);
        // Clean the token out of the URL so it isn't bookmarked or shared.
        window.history.replaceState({}, "", "/login");

        (async () => {
            try {
                const res = await fetch("http://localhost:5001/api/auth/me", {
                    headers: { Authorization: "Bearer " + token }
                });
                if (!res.ok) throw new Error("auth check failed");
                const data = await res.json();
                setUser(data.user);
                navigate("/");
            } catch (err) {
                console.error("Google login failed:", err);
                localStorage.removeItem("token");
                toast("Could not complete Google sign-in.");
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loginUser(e) {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:5001/api/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                setUser(data.user);
                navigate("/");
            } else {
                toast(data.error || "Invalid email or password");
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast("Something went wrong. Please try again.");
        }
    }

    function loginWithGoogle() {
        window.location.href = "http://localhost:5001/api/auth/google";
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <img src={apexLogo} alt="APEX" className="auth-logo" />
                    <p className="auth-tagline">Map your path to the top.</p>
                </div>

                <div className="auth-content">
                    <h2 className="auth-title">Welcome back</h2>
                    <p className="auth-subtitle">Log in to your APEX account</p>

                    <form className="auth-form" onSubmit={loginUser}>
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
                            Log in
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <button className="auth-google" onClick={loginWithGoogle}>
                        Continue with Google
                    </button>

                    <p className="auth-switch">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}