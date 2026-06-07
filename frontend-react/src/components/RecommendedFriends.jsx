import { useEffect, useState } from "react";
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

function RecommendedFriends() {
    const toast = useToast();
    const [people, setPeople] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [sent, setSent] = useState([]);

    async function load() {
        try {
            const res = await fetch(`${API}/recommendations`, {
                headers: authHeader()
            });
            const data = await res.json();
            setPeople(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load recommendations:", error);
            setPeople([]);
        } finally {
            setLoaded(true);
        }
    }

    useEffect(() => {
        load();
    }, []);

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

    // Nothing to show until the user has set a career goal / has matches
    if (loaded && people.length === 0) return null;

    return (
        <div>
            <h3>Suggested for You</h3>
            <p className="muted">People with career goals similar to yours.</p>

            <div className="suggestion-grid">
                {people.map((user) => (
                    <div key={user._id} className="friend-card">
                        <div className="friend-avatar">{initials(user.name)}</div>
                        <div className="friend-info">
                            <Link
                                to={`/profile/${user._id}`}
                                className="friend-name-link"
                            >
                                <span className="friend-name">{user.name}</span>
                            </Link>
                            {user.careerGoal && (
                                <span className="friend-goal">{user.careerGoal}</span>
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
        </div>
    );
}

export default RecommendedFriends;
