import { useState } from "react";

const API = "http://localhost:5001/api/friends";

function authHeader(json) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
}

function UserList() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [sent, setSent] = useState([]);

    async function search(e) {
        e.preventDefault();
        if (!query.trim()) return;
        try {
            const res = await fetch(`${API}/search?q=${encodeURIComponent(query.trim())}`, {
                headers: authHeader()
            });
            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
            setSearched(true);
        } catch (error) {
            console.error("Failed to search users:", error);
            setResults([]);
            setSearched(true);
        }
    }

    async function sendRequest(id) {
        try {
            const res = await fetch(`${API}/request`, {
                method: "POST",
                headers: authHeader(true),
                body: JSON.stringify({ toUserId: id })
            });
            const data = await res.json();
            if (res.ok) {
                setSent((prev) => [...prev, id]);
            } else {
                alert(data.error || "Could not send request");
            }
        } catch (error) {
            console.error("Failed to send request:", error);
        }
    }

    return (
        <div>
            <h3>Find People</h3>

            <form className="search-form" onSubmit={search}>
                <input
                    className="search-input"
                    placeholder="Search by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn-primary" type="submit">
                    Search
                </button>
            </form>

            {searched && results.length === 0 && <p>No users found.</p>}

            {results.map((user) => (
                <div key={user._id} className="user-card">
                    <h3>{user.name}{user.careerGoal ? ` - ${user.careerGoal}` : ""}</h3>
                    <p>{user.email}</p>
                    <button
                        onClick={() => sendRequest(user._id)}
                        disabled={sent.includes(user._id)}
                    >
                        {sent.includes(user._id) ? "Sent" : "Connect"}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default UserList;
