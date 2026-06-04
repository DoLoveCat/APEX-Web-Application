import { useState } from "react";

function UserList({ users }) {
    const [requests, setRequests] = useState([]);
    
    async function SendRequest(id) {
        try {
            const response = await fetch("http://localhost:5000/api/users/send-friend-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ friendId: id })
            });

            const data = await response.json();

            if (response.ok) {
                setRequests(prev => [...prev, id]);
            }

            alert(data.message);
        } catch (error) {
            console.log(error);
        }
    }


    if (!Array.isArray(users) || users.length === 0) return <p> No users found.</p>;

    return(
        <div>
            <h3> All Users </h3>
            {users.map(user => (
                <div key={user._id} className="user-card">
                    <h3>{user.name} - {user.careerGoal}</h3>
                    <p>{user.email}</p>
                    <button onClick={() => SendRequest(user._id)} disabled={requests.includes(user._id)}>
                        {requests.includes(user._id) ? "Sent" : "Connect"}
                    </button>

                </div>
            ))}
        </div>
    );
}

export default UserList;