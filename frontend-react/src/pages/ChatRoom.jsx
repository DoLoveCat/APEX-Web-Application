import React from "react";

import { useEffect, useState, useCallback, useRef } from "react";
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

    const bottomRef = useRef(null);

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

    // keep the newest message in view
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const isMine = (msg) =>
        currentUser && String(msg.userId) === String(currentUser._id);

    function initials(name) {
        return (name || "?")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || "")
            .join("");
    }

    function formatTime(value) {
        if (!value) return "";
        return new Date(value).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

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
        <div className="chat">
            <header className="chat-header">
                <button
                    className="chat-back"
                    onClick={() => navigate("/network")}
                    aria-label="Back to network"
                >
                    ←
                </button>
                <div className="chat-avatar">{initials(roomName)}</div>
                <div className="chat-header-info">
                    <span className="chat-title">{roomName || `Room ${roomId}`}</span>
                    {room?.isDirect && <span className="chat-subtitle">Direct message</span>}
                </div>
            </header>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <p className="chat-empty muted">No messages yet. Say hi! 👋</p>
                ) : (
                    messages.map((msg) => {
                        const mine = isMine(msg);
                        const liked = myName && msg.thumbsUp?.includes(myName);
                        const disliked = myName && msg.thumbsDown?.includes(myName);
                        return (
                            <div
                                key={msg._id}
                                className={`msg-row ${mine ? "mine" : "theirs"}`}
                            >
                                <div className="bubble">
                                    {!mine && (
                                        <span className="bubble-sender">{msg.username}</span>
                                    )}

                                    {editingId === msg._id ? (
                                        <div className="bubble-edit">
                                            <input
                                                className="bubble-edit-input"
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                            />
                                            <div className="bubble-edit-actions">
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => saveEdit(msg._id)}
                                                >
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
                                        </div>
                                    ) : (
                                        <p className="bubble-text">{msg.text}</p>
                                    )}

                                    <span className="bubble-time">
                                        {formatTime(msg.createdAt)}
                                    </span>

                                    {msg.replies && msg.replies.length > 0 && (
                                        <div className="bubble-replies">
                                            {msg.replies.map((reply, i) => (
                                                <p
                                                    key={reply._id || i}
                                                    className="bubble-reply"
                                                >
                                                    <strong>{reply.username}:</strong>{" "}
                                                    {reply.text}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="msg-actions">
                                    <button
                                        className={`msg-action ${liked ? "active" : ""}`}
                                        onClick={() => vote(msg._id, "thumbsup")}
                                    >
                                        👍 {msg.thumbsUp ? msg.thumbsUp.length : 0}
                                    </button>
                                    <button
                                        className={`msg-action ${disliked ? "active" : ""}`}
                                        onClick={() => vote(msg._id, "thumbsdown")}
                                    >
                                        👎 {msg.thumbsDown ? msg.thumbsDown.length : 0}
                                    </button>
                                    <button
                                        className="msg-action"
                                        onClick={() =>
                                            setReplyingTo(
                                                replyingTo === msg._id ? null : msg._id
                                            )
                                        }
                                    >
                                        Reply
                                    </button>
                                    {mine && (
                                        <>
                                            <button
                                                className="msg-action"
                                                onClick={() => startEdit(msg)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="msg-action"
                                                onClick={() => deleteMessage(msg._id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>

                                {replyingTo === msg._id && (
                                    <div className="reply-box">
                                        <input
                                            className="bubble-edit-input"
                                            placeholder="Write a reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                        <button
                                            className="btn-primary"
                                            onClick={() => sendReply(msg._id)}
                                        >
                                            Send
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <form className="chat-compose" onSubmit={sendMessage}>
                <input
                    className="chat-input"
                    placeholder="Type a message..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                />
                <button className="chat-send" type="submit" aria-label="Send">
                    ➤
                </button>
            </form>
        </div>
    );
}
