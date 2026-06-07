import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5001/api/chat";

function initials(name) {
    return (name || "?")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

function formatWhen(value) {
    if (!value) return "";
    const d = new Date(value);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay
        ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function Messages() {
    const navigate = useNavigate();
    const [convos, setConvos] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${API}/conversations`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                setConvos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to load conversations:", error);
            } finally {
                setLoaded(true);
            }
        }
        load();
    }, []);

    return (
        <div>
            <h2>Messages</h2>

            {loaded && convos.length === 0 && (
                <div className="home-empty">
                    <div className="home-empty-icon">💬</div>
                    <p className="muted">
                        No conversations yet. Message a friend from the Network
                        page to start chatting.
                    </p>
                </div>
            )}

            <div className="convo-list">
                {convos.map((c) => (
                    <button
                        key={c.roomId}
                        className="convo-item"
                        onClick={() => navigate(`/chat/${c.roomId}`)}
                    >
                        <div className="convo-avatar">{initials(c.name)}</div>
                        <div className="convo-info">
                            <span className="convo-name">{c.name}</span>
                            <span className="convo-preview">
                                {c.lastText || "No messages yet"}
                            </span>
                        </div>
                        <span className="convo-time">{formatWhen(c.lastAt)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
