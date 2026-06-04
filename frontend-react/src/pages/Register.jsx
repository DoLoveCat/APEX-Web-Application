import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function registerUser() {
        const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            credentials: "include",

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

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
        </div>
    );
}