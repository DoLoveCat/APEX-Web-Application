const API = "http://localhost:5001/api/friends";

function authHeader(json) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
}

function IncomingRequests({ requests, loadRequests, loadFriends }) {
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
            } else {
                alert(data.error || "Could not update request");
            }
        } catch (error) {
            console.error("Failed to respond to request:", error);
        }
    }

    if (!Array.isArray(requests) || requests.length === 0)
        return <p> No Friend Requests </p>;

    return (
        <div>
            <h3> Incoming Friend Requests </h3>
            {requests.map((request) => {
                const sender = request.from || {};
                return (
                    <div key={request._id} className="request-card">
                        <h3>
                            {sender.name}
                            {sender.careerGoal ? ` - ${sender.careerGoal}` : ""}
                        </h3>
                        <p>{sender.email}</p>
                        <button onClick={() => respond("accept", request._id)}>
                            Accept
                        </button>
                        <button onClick={() => respond("decline", request._id)}>
                            Decline
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default IncomingRequests;
