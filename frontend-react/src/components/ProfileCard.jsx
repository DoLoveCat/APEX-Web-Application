import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useSavedCourses } from "../context/SavedCoursesContext";

function initials(name) {
    return (name || "?")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

export default function ProfileCard({ user }) {
    const connections = user?.friends?.length || 0;

    const { saved } = useSavedCourses();
    const savedCount = saved?.length || 0;

    const [pending, setPending] = useState(0);

    useEffect(() => {
        async function loadPending() {
            try {
                const res = await fetch(
                    "http://localhost:5001/api/friends/requests",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                const data = await res.json();
                setPending(Array.isArray(data) ? data.length : 0);
            } catch (error) {
                console.error("Failed to load pending requests:", error);
            }
        }
        loadPending();
    }, []);

    return (
        <div className="profile-card">
            <Link to="/profile" className="profile-banner-link">
                <div className="profile-banner" />
                <div className="profile-avatar">{initials(user?.name)}</div>
            </Link>

            <div className="profile-body">
                <Link to="/profile" className="profile-name-link">
                    <h3 className="profile-name">{user?.name || "Your name"}</h3>
                </Link>
                <p className="profile-headline">
                    {user?.careerGoal || "Add your career goal"}
                </p>
                {user?.role && <p className="profile-role">🎓 {user.role}</p>}
            </div>

            <Link to="/network" className="profile-stat">
                <span>Connections</span>
                <strong>{connections}</strong>
            </Link>
            <Link to="/my-courses" className="profile-stat">
                <span>Saved courses</span>
                <strong>{savedCount}</strong>
            </Link>
            <Link to="/network" className="profile-stat">
                <span>Pending requests</span>
                <strong>{pending}</strong>
            </Link>
        </div>
    );
}
