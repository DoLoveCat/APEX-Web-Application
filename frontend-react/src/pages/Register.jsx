import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function registerUser() {
        const response = await fetch(
        "http://localhost:5001/api/auth/signup",
        {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: "student"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Registration failed");
            return;
        }

        alert(data.message);
        navigate("/login");
    }

    return (
        <div>
            <h2> Register </h2>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <br /><br />

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
                onClick={registerUser}
                style={{ marginLeft: "10px" }}
            >
                Register
            </button>

            <p>
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Log in
                </button>
            </p>
        </div>
    );
}