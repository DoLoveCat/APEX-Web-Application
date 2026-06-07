import React from "react";

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:5001/api/chat";

function authHeader(json) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
}

export default function ChatRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);

    const [newText, setNewText] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    // --- data loading ---
    const loadMessages = useCallback(async () => {
        try {
            const res = await fetch(`${API}/rooms/${roomId}/messages`, {
                headers: authHeader()
            });
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    }, [roomId]);

    // current user (to know which messages are mine)
    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const res = await fetch("http://localhost:5001/api/auth/me", {
                    headers: authHeader()
                });
                const data = await res.json();
                if (res.ok) setCurrentUser(data.user);
            } catch (error) {
                console.error("Failed to load current user:", error);
            }
        }
        loadCurrentUser();
    }, []);

    // look up this room (the URL only carries the code) for its title
    useEffect(() => {
        async function loadRoom() {
            try {
                const res = await fetch(`${API}/rooms/${roomId}`, { headers: authHeader() });
                const data = await res.json();
                if (res.ok) setRoom(data);
            } catch (error) {
                console.error("Failed to load room:", error);
            }
        }
        loadRoom();
    }, [roomId]);

    // direct rooms are titled after the other participant; group rooms by name
    const roomName = room?.isDirect
        ? (room.participants || []).find(
              (p) => !currentUser || String(p._id) !== String(currentUser._id)
          )?.name || ""
        : room?.name || "";

    // poll messages every 3 seconds
    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [loadMessages]);

    const isMine = (msg) =>
        currentUser && String(msg.userId) === String(currentUser._id);

    // --- actions ---
    async function sendMessage(e) {
        e.preventDefault();
        if (!newText.trim()) return;
        try {
            await fetch(`${API}/rooms/${roomId}/messages`, {
                method: "POST",
                headers: authHeader(true),
                body: JSON.stringify({ text: newText })
            });
            setNewText("");
            loadMessages();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }

    function startEdit(msg) {
        setEditingId(msg._id);
        setEditText(msg.text);
    }

    async function saveEdit(messageId) {
        if (!editText.trim()) return;
        try {
            await fetch(`${API}/messages/${messageId}`, {
                method: "PUT",
                headers: authHeader(true),
                body: JSON.stringify({ text: editText })
            });
            setEditingId(null);
            setEditText("");
            loadMessages();
        } catch (error) {
            console.error("Failed to edit message:", error);
        }
    }

    async function deleteMessage(messageId) {
        try {
            await fetch(`${API}/messages/${messageId}`, {
                method: "DELETE",
                headers: authHeader()
            });
            loadMessages();
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    }

    async function sendReply(messageId) {
        if (!replyText.trim()) return;
        try {
            await fetch(`${API}/messages/${messageId}/reply`, {
                method: "POST",
                headers: authHeader(true),
                body: JSON.stringify({ text: replyText })
            });
            setReplyingTo(null);
            setReplyText("");
            loadMessages();
        } catch (error) {
            console.error("Failed to reply:", error);
        }
    }

    async function vote(messageId, kind) {
        try {
            await fetch(`${API}/messages/${messageId}/${kind}`, {
                method: "POST",
                headers: authHeader()
            });
            loadMessages();
        } catch (error) {
            console.error("Failed to vote:", error);
        }
    }

    const myName = currentUser?.name;

    return (
        <div>
            <button className="btn-secondary" onClick={() => navigate("/chat")}>
                ← Back to rooms
            </button>

            <h2 style={{ marginBottom: 0 }}>{roomName || `Room ${roomId}`}</h2>
            {!room?.isDirect && (
                <p className="muted" style={{ marginTop: "4px" }}>Code: {roomId}</p>
            )}

            {messages.length === 0 ? (
                <p className="muted">No messages yet. Say hi!</p>
            ) : (
                messages.map((msg) => (
                    <div key={msg._id} className="course-card">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong>{msg.username}</strong>
                            <span className="muted" style={{ fontSize: "0.8rem" }}>
                                {msg.createdAt && new Date(msg.createdAt).toLocaleString()}
                            </span>
                        </div>

                        {editingId === msg._id ? (
                            <div style={{ margin: "8px 0" }}>
                                <input
                                    className="search-input"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button className="btn-primary" onClick={() => saveEdit(msg._id)}>
                                    Save
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        setEditingId(null);
                                        setEditText("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <p style={{ margin: "8px 0" }}>{msg.text}</p>
                        )}

                        {/* actions */}
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                            <button onClick={() => vote(msg._id, "thumbsup")}>
                                👍 {msg.thumbsUp ? msg.thumbsUp.length : 0}
                                {myName && msg.thumbsUp?.includes(myName) ? " ✓" : ""}
                            </button>
                            <button onClick={() => vote(msg._id, "thumbsdown")}>
                                👎 {msg.thumbsDown ? msg.thumbsDown.length : 0}
                                {myName && msg.thumbsDown?.includes(myName) ? " ✓" : ""}
                            </button>
                            <button
                                onClick={() =>
                                    setReplyingTo(replyingTo === msg._id ? null : msg._id)
                                }
                            >
                                Reply
                            </button>

                            {isMine(msg) && (
                                <>
                                    <button onClick={() => startEdit(msg)}>Edit</button>
                                    <button onClick={() => deleteMessage(msg._id)}>Delete</button>
                                </>
                            )}
                        </div>

                        {/* replies */}
                        {msg.replies && msg.replies.length > 0 && (
                            <div style={{ marginTop: "8px", paddingLeft: "16px", borderLeft: "2px solid #e3e8f2" }}>
                                {msg.replies.map((reply, i) => (
                                    <p key={reply._id || i} style={{ margin: "4px 0" }}>
                                        <strong>{reply.username}:</strong> {reply.text}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* reply box */}
                        {replyingTo === msg._id && (
                            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                                <input
                                    className="search-input"
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <button className="btn-primary" onClick={() => sendReply(msg._id)}>
                                    Send
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* compose new message */}
            <form className="search-form" onSubmit={sendMessage}>
                <input
                    className="search-input"
                    placeholder="Type a message..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                />
                <button className="btn-primary" type="submit">
                    Send
                </button>
            </form>
        </div>
    );
}
