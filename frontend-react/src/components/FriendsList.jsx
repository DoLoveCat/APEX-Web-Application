import { useNavigate, Link } from "react-router-dom";

import { useToast } from "../context/ToastContext";

function authHeader(json) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
}

function FriendsList({ friends }) {
    const navigate = useNavigate();
    const toast = useToast();

    async function openChat(friendId) {
        try {
            const res = await fetch("http://localhost:5001/api/chat/direct", {
                method: "POST",
                headers: authHeader(true),
                body: JSON.stringify({ friendId })
            });
            const room = await res.json();
            if (res.ok && room.roomId) {
                navigate(`/chat/${room.roomId}`);
            } else {
                toast(room.error || "Could not open chat");
            }
        } catch (error) {
            console.error("Failed to open chat:", error);
        }
    }

    function initials(name) {
        return (name || "")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || "")
            .join("");
    }

    if (!Array.isArray(friends) || friends.length === 0) {
        return (
            <div>
                <h3>Friends</h3>
                <p className="muted">No friends yet — search above to connect with people.</p>
            </div>
        );
    }

    return (
        <div>
            <h3>Friends</h3>
            <div className="friend-list">
                {friends.map((friend) => (
                    <div key={friend._id} className="friend-card">
                        <div className="friend-avatar">{initials(friend.name)}</div>
                        <div className="friend-info">
                            <Link
                                to={`/profile/${friend._id}`}
                                className="friend-name-link"
                            >
                                <span className="friend-name">{friend.name}</span>
                            </Link>
                            {friend.careerGoal && (
                                <span className="friend-goal">{friend.careerGoal}</span>
                            )}
                        </div>
                        <button
                            className="message-btn"
                            onClick={() => openChat(friend._id)}
                        >
                            <span aria-hidden="true">💬</span> Message
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FriendsList;
