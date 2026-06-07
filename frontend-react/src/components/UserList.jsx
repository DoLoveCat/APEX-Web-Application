import { useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "../context/ToastContext";

const API = "http://localhost:5001/api/friends";

function authHeader(json) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
}

function initials(name) {
    return (name || "?")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

function UserList() {
    const toast = useToast();
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
                toast("Friend request sent", "success");
            } else {
                toast(data.error || "Could not send request");
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

            {searched && results.length === 0 && (
                <p className="muted">No users found.</p>
            )}

            {results.length > 0 && (
                <div className="friend-list">
                    {results.map((user) => (
                        <div key={user._id} className="friend-card">
                            <div className="friend-avatar">
                                {initials(user.name)}
                            </div>
                            <div className="friend-info">
                                <Link
                                    to={`/profile/${user._id}`}
                                    className="friend-name-link"
                                >
                                    <span className="friend-name">
                                        {user.name}
                                    </span>
                                </Link>
                                {user.careerGoal && (
                                    <span className="friend-goal">
                                        {user.careerGoal}
                                    </span>
                                )}
                            </div>
                            <button
                                className="btn-primary"
                                onClick={() => sendRequest(user._id)}
                                disabled={sent.includes(user._id)}
                            >
                                {sent.includes(user._id) ? "Sent ✓" : "Connect"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserList;
