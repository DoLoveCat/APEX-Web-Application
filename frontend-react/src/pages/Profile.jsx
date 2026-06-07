import { useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "../context/ToastContext";
import { useSavedCourses } from "../context/SavedCoursesContext";

const COURSES_API = "http://localhost:5001/api/courses";
const USERS_API = "http://localhost:5001/api/users";

function initials(name) {
    return (name || "?")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

export default function Profile({ user, setUser }) {
    const toast = useToast();
    const { saved } = useSavedCourses();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [goal, setGoal] = useState(user?.careerGoal || "");
    const [saving, setSaving] = useState(false);

    const connections = user?.friends?.length || 0;
    const savedCount = saved?.length || 0;

    function authHeader(json) {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        if (json) headers["Content-Type"] = "application/json";
        return headers;
    }

    async function save() {
        setSaving(true);
        try {
            let updated = { ...user };

            // 1. Name
            if (name.trim() && name.trim() !== user?.name) {
                const res = await fetch(`${USERS_API}/me`, {
                    method: "PUT",
                    headers: authHeader(true),
                    body: JSON.stringify({ name: name.trim() })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to update name");
                updated = { ...updated, name: data.user.name };
            }

            // 2. Career goal (+ embedding so recommendations stay in sync)
            if (goal.trim() !== (user?.careerGoal || "")) {
                const embedRes = await fetch(
                    `${COURSES_API}/embed?q=${encodeURIComponent(goal.trim())}`,
                    { headers: authHeader() }
                );
                const { embedding } = await embedRes.json();

                const res = await fetch(`${USERS_API}/career-goal`, {
                    method: "PUT",
                    headers: authHeader(true),
                    body: JSON.stringify({ careerGoal: goal.trim(), embedding })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to update goal");
                updated = { ...updated, careerGoal: data.careerGoal };
            }

            setUser(updated);
            setEditing(false);
            toast("Profile updated", "success");
        } catch (err) {
            toast(err.message || "Could not update profile");
        } finally {
            setSaving(false);
        }
    }

    function cancel() {
        setName(user?.name || "");
        setGoal(user?.careerGoal || "");
        setEditing(false);
    }

    return (
        <div className="profile-page">
            <div className="profile-hero">
                <div className="profile-hero-banner" />
                <div className="profile-hero-avatar">{initials(user?.name)}</div>

                <div className="profile-hero-body">
                    {editing ? (
                        <div className="profile-edit">
                            <label className="profile-label">Name</label>
                            <input
                                className="auth-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label className="profile-label">Career goal</label>
                            <input
                                className="auth-input"
                                value={goal}
                                placeholder="e.g. software engineer"
                                onChange={(e) => setGoal(e.target.value)}
                            />
                            <div className="profile-edit-actions">
                                <button
                                    className="btn-primary"
                                    onClick={save}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={cancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="profile-hero-name">{user?.name}</h1>
                            <p className="profile-hero-goal">
                                {user?.careerGoal || "No career goal set yet."}
                            </p>
                            <div className="profile-meta">
                                {user?.role && (
                                    <span className="profile-badge">
                                        🎓 {user.role}
                                    </span>
                                )}
                                {user?.email && (
                                    <span className="profile-email">
                                        ✉ {user.email}
                                    </span>
                                )}
                            </div>
                            <button
                                className="btn-secondary profile-edit-btn"
                                onClick={() => setEditing(true)}
                            >
                                Edit profile
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="profile-stats-row">
                <Link to="/network" className="stat-card">
                    <span className="stat-num">{connections}</span>
                    <span className="stat-label">Connections</span>
                </Link>
                <Link to="/my-courses" className="stat-card">
                    <span className="stat-num">{savedCount}</span>
                    <span className="stat-label">Saved courses</span>
                </Link>
            </div>
        </div>
    );
}
