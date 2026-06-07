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

function IncomingRequests({ requests, loadRequests, loadFriends }) {
    const toast = useToast();

    async function respond(path, requestId) {
        try {
            const res = await fetch(`${API}/${path}`, {
                method: "POST",
                headers: authHeader(true),
                body: JSON.stringify({ requestId })
            });
            const data = await res.json();
            if (res.ok) {
                loadRequests();
                loadFriends();
                toast(
                    path === "accept" ? "Friend added" : "Request declined",
                    path === "accept" ? "success" : "info"
                );
            } else {
                toast(data.error || "Could not update request");
            }
        } catch (error) {
            console.error("Failed to respond to request:", error);
        }
    }

    if (!Array.isArray(requests) || requests.length === 0)
        return (
            <div>
                <h3>Incoming Friend Requests</h3>
                <p className="muted">No pending friend requests.</p>
            </div>
        );

    return (
        <div>
            <h3>Incoming Friend Requests</h3>
            <div className="friend-list">
                {requests.map((request) => {
                    const sender = request.from || {};
                    return (
                        <div key={request._id} className="friend-card">
                            <div className="friend-avatar">
                                {initials(sender.name)}
                            </div>
                            <div className="friend-info">
                                <span className="friend-name">{sender.name}</span>
                                {sender.careerGoal && (
                                    <span className="friend-goal">
                                        {sender.careerGoal}
                                    </span>
                                )}
                            </div>
                            <div className="request-actions">
                                <button
                                    className="btn-primary"
                                    onClick={() => respond("accept", request._id)}
                                >
                                    Accept
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={() => respond("decline", request._id)}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default IncomingRequests;
