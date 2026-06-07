import { useNavigate } from "react-router-dom";

function authHeader(json) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
}

function FriendsList({ friends }) {
    const navigate = useNavigate();

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
                alert(room.error || "Could not open chat");
            }
        } catch (error) {
            console.error("Failed to open chat:", error);
        }
    }

    if (!Array.isArray(friends) || friends.length === 0) return <p> No Friends.</p>;

    return (
        <div>
            <h3> Friends </h3>
            {friends.map((friend) => (
                <div key={friend._id} className="friend-card">
                    <h3>{friend.name}{friend.careerGoal ? ` - ${friend.careerGoal}` : ""}</h3>
                    <button onClick={() => openChat(friend._id)}>Message</button>
                </div>
            ))}
        </div>
    );
}

export default FriendsList;
