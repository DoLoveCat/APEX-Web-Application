import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({setUser}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function loginUser() {
        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        console.log("Login response:", data);

        if (response.ok) {
            setUser(data.user);
            navigate("/");
        } else {
            alert(data.message);
        }
    }

    function loginWithGoogle() {
        window.location.href = "http://localhost:5000/api/auth/google";
    }

    return (
        <div>
            <h2> Login </h2>

            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={loginUser}
                style={{ marginLeft: "10px" }}
            >
                Login
            </button>

            <button
                onClick={loginWithGoogle}
                style={{ marginLeft: "10px" }}
            >
                Login with Google
            </button>

            <br /><br />

            <p>Don't have an account? <a href="/register">Register</a></p>

        </div>
    );
}