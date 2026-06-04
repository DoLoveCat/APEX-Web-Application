import { useState } from "react";

function IncomingRequests({ requests, loadRequests, loadFriends }) {
    const [accepted, setAccepted] = useState([]);
    
    async function acceptRequest(id) {
        try {
            const response = await fetch("http://localhost:5000/api/users/accept-friend-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ incomingId: id })
            });

            const data = await response.json();

            if (response.ok) {
                setAccepted(prev => [...prev, id]);
                loadRequests();
                loadFriends();
            }

            alert(data.message);
        } catch (error) {
            console.log(error);
        }
    }


    if (!Array.isArray(requests) || requests.length === 0) return <p> No Friend Requests </p>;

    return(
        <div>
            <h3> Incoming Friend Requests </h3>
            {requests.map(request => (
                <div key={request._id} className="request-card">
                    <h3>{request.name} - {request.careerGoal}</h3>
                    <p>{request.email}</p>
                    <button onClick={() => acceptRequest(request._id)} disabled={accepted.includes(request._id)}>
                        {accepted.includes(request._id) ? "Connected" : "Accept"}
                    </button>

                </div>
            ))}
        </div>
    );
}

export default IncomingRequests;