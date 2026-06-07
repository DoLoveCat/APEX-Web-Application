import React from "react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5001/api/chat";

function authHeader(json) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
}

export default function ChatRooms() {
    const [rooms, setRooms] = useState([]);
    const [newName, setNewName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    const navigate = useNavigate();

    async function loadRooms() {
        try {
            const response = await fetch(`${API}/rooms`, { headers: authHeader() });
            const data = await response.json();
            setRooms(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load rooms:", error);
            setRooms([]);
        }
    }

    async function createRoom() {
        try {
            const response = await fetch(`${API}/rooms`, {
                method: "POST",
                headers: authHeader(true),
                body: JSON.stringify({ name: newName })
            });
            const room = await response.json();
            if (response.ok && room.roomId) {
                navigate(`/chat/${room.roomId}`);
            }
        } catch (error) {
            console.error("Failed to create room:", error);
        }
    }

    function startEdit(room) {
        setEditingId(room._id);
        setEditName(room.name || "");
    }

    async function saveRename(room) {
        try {
            await fetch(`${API}/rooms/${room.roomId}`, {
                method: "PUT",
                headers: authHeader(true),
                body: JSON.stringify({ name: editName })
            });
            setEditingId(null);
            setEditName("");
            loadRooms();
        } catch (error) {
            console.error("Failed to rename room:", error);
        }
    }

    useEffect(() => {
        loadRooms();
    }, []);

    return (
        <div>
            <h2>Chat Rooms</h2>

            <div className="search-form">
                <input
                    className="search-input"
                    placeholder="Room name (optional)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button className="btn-primary" onClick={createRoom}>
                    + Create Room
                </button>
            </div>

            {rooms.length === 0 ? (
                <p className="muted">No chat rooms yet. Create one to get started.</p>
            ) : (
                <div>
                    {rooms.map((room) => (
                        <div
                            key={room._id}
                            className="course-card"
                            style={{ cursor: editingId === room._id ? "default" : "pointer" }}
                            onClick={() => {
                                if (editingId !== room._id) navigate(`/chat/${room.roomId}`);
                            }}
                        >
                            {editingId === room._id ? (
                                <div
                                    style={{ display: "flex", gap: "8px" }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        className="search-input"
                                        value={editName}
                                        placeholder="Room name"
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                    <button
                                        className="btn-primary"
                                        onClick={() => saveRename(room)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditName("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        <h3 style={{ margin: 0 }}>
                                            {room.name || `Room ${room.roomId}`}
                                        </h3>
                                        <button
                                            className="btn-secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEdit(room);
                                            }}
                                        >
                                            Rename
                                        </button>
                                    </div>
                                    <p className="muted" style={{ margin: "4px 0 0" }}>
                                        Code: {room.roomId}
                                        {room.createdAt &&
                                            ` · Created ${new Date(room.createdAt).toLocaleString()}`}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
