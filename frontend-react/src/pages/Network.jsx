import React from "react";

import { useEffect, useState } from "react";

import UserList from "../components/UserList";
import IncomingRequests from "../components/IncomingRequests";
import FriendsList from "../components/FriendsList";

const API = "http://localhost:5001/api/friends";

export default function Network() {
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);

    const authHeader = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };

    async function loadRequests() {
        try {
            const response = await fetch(`${API}/requests`, { headers: authHeader });
            const data = await response.json();
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load requests:", error);
            setRequests([]);
        }
    }

    async function loadFriends() {
        try {
            const response = await fetch(`${API}`, { headers: authHeader });
            const data = await response.json();
            setFriends(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load friends:", error);
            setFriends([]);
        }
    }

    useEffect(() => {
        loadFriends();
        loadRequests();
    }, []);

    return (
        <div>
            <h2>Network</h2>

            <UserList />

            <br/>

            <FriendsList friends={friends}/>

            <br/>

            <IncomingRequests requests={requests} loadRequests={loadRequests} loadFriends={loadFriends}/>

        </div>
    );
}
