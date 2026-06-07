import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { useToast } from "../context/ToastContext";

const API = "http://localhost:5001/api";

function initials(name) {
    return (name || "?")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

export default function PublicProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sent, setSent] = useState(false);

    function authHeader(json) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        if (json) headers["Content-Type"] = "application/json";
        return headers;
    }

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${API}/users/${id}`, {
                    headers: authHeader()
                });
                const data = await res.json();
                if (res.ok) setProfile(data);
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    async function connect() {
        try {
            const res = await fetch(`${API}/friends/request`, {
                method: "POST",
                headers: authHeader(true),
                body: JSON.stringify({ toUserId: id })
            });
            const data = await res.json();
            if (res.ok) {
                setSent(true);
                toast("Friend request sent", "success");
            } else {
                toast(data.error || "Could not send request");
            }
        } catch (error) {
            console.error("Connect failed:", error);
        }
    }

    async function message() {
        try {
            const res = await fetch(`${API}/chat/direct`, {
                method: "POST",
                headers: authHeader(true),
                body: JSON.stringify({ friendId: id })
            });
            const room = await res.json();
            if (res.ok && room.roomId) {
                navigate(`/chat/${room.roomId}`);
            } else {
                toast(room.error || "Could not open chat");
            }
        } catch (error) {
            console.error("Message failed:", error);
        }
    }

    if (loading) return <p className="muted">Loading profile…</p>;

    if (!profile)
        return (
            <div>
                <p className="muted">User not found.</p>
                <Link to="/network">← Back to Network</Link>
            </div>
        );

    return (
        <div className="profile-page">
            <div className="profile-hero">
                <div className="profile-hero-banner" />
                <div className="profile-hero-avatar">{initials(profile.name)}</div>

                <div className="profile-hero-body">
                    <h1 className="profile-hero-name">{profile.name}</h1>
                    <p className="profile-hero-goal">
                        {profile.careerGoal || "No career goal set."}
                    </p>
                    {profile.role && (
                        <span className="profile-badge">🎓 {profile.role}</span>
                    )}

                    <div className="profile-actions">
                        {profile.isFriend ? (
                            <button className="btn-primary" onClick={message}>
                                💬 Message
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={connect}
                                disabled={sent}
                            >
                                {sent ? "Sent ✓" : "Connect"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="profile-stats-row">
                <div className="stat-card">
                    <span className="stat-num">{profile.connections}</span>
                    <span className="stat-label">Connections</span>
                </div>
            </div>
        </div>
    );
}
