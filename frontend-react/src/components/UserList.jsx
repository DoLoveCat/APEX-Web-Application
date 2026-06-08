import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useToast } from "../context/ToastContext";

const FRIENDS_API = "http://localhost:5001/api/friends";
const USERS_API = "http://localhost:5001/api/users/"; 

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

function UserList({ isAdmin }) {
    const toast = useToast();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(false);

    async function loadAllUsers() {
        setLoading(true);
        try {
            const res = await fetch(USERS_API, {
                headers: authHeader()
            });
            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
            setSearched(true);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isAdmin) loadAllUsers();
    }, [isAdmin]);


    async function search(e) {
        e.preventDefault();
        if (!query.trim()) return;
        try {
            const res = await fetch(`${FRIENDS_API}/search?q=${encodeURIComponent(query.trim())}`, {
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
            const res = await fetch(`${FRIENDS_API}/request`, {
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

    async function deleteUser(id) {
        try {
            const res = await fetch(`${USERS_API}/${id}`, {
                method: "DELETE",
                headers: authHeader()
            });
            const data = await res.json();
            if (res.ok) {
                toast("User deleted", "success");
                loadAllUsers();
            } else {
                toast(data.error || "Could not delete user");
            }
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    }

    const displayed = isAdmin
        ? results.filter((u) => u.name?.toLowerCase().includes(query.toLowerCase()))
        : results;

    return (
        <div>
            <h3>Find People</h3>

            {isAdmin ? (
                <input
                    className="search-input"
                    placeholder="Filter by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            ) : (
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
            )}

            {loading && <p>Loading...</p>}

            {searched && displayed.length === 0 && (
                <p className="muted">No users found.</p>
            )}

            {displayed.length  > 0 && (
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

                            {isAdmin ? (
                                <button
                                    className="btn-admin-delete"
                                    onClick={() => deleteUser(user._id)}
                                >
                                    Delete
                                </button>
                            ) : (
                                <button
                                    className="btn-primary"
                                    onClick={() => sendRequest(user._id)}
                                    disabled={sent.includes(user._id)}
                                >
                                    {sent.includes(user._id) ? "Sent ✓" : "Connect"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserList;
