import React from "react";

import { useEffect, useState } from "react";

//import Profile from "../components/Profile";
import UserList from "../components/UserList";
import IncomingRequests from "../components/IncomingRequests";
import FriendsList from "../components/FriendsList";

export default function Network() {
    const [me, setMe] = useState([]);
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);

    // async function loadMe() {
    //     const response = await fetch("http://localhost:5000/api/users/me", {
    //         credentials: "include"
    //     });

    //     const data = await response.json();
    //     setUsers(Array.isArray(data) ? data : []);
    // }

    async function loadUsers() {
        const response = await fetch("http://localhost:5000/api/users/users", {
            credentials: "include"
        });

        const data = await response.json();
        console.log("Browse data:", data);
        setUsers(Array.isArray(data) ? data : []);
    }

    async function loadRequests() {
        const response = await fetch("http://localhost:5000/api/users/incoming-requests", {
            credentials: "include"
        });

        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []);
    }

    async function loadFriends() {
        const response = await fetch("http://localhost:5000/api/users/friends", {
            credentials: "include"
        });

        const data = await response.json();
        setFriends(Array.isArray(data) ? data : []);
    }

    useEffect(() => {
        //loadMe();
        loadUsers();
        loadFriends();
        loadRequests();
    }, []);
    
    return (
        <div>

            <h2>Network</h2>
            
            <UserList users={users}/>

            <br/>

            <FriendsList friends={friends}/>

            <br/>
            
            <IncomingRequests requests={requests} loadRequests={loadRequests} loadFriends={loadFriends}/>

        </div>
    );
}