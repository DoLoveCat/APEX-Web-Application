import UserList from "../components/UserList";

export default function AdminUsers() {
    
    return (
        <div>
            <h2>Manage Users</h2>
            <UserList isAdmin={true} />
        </div>
    );
}