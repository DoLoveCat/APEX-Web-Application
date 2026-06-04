function FriendsList({ friends }) {
    if (!Array.isArray(friends) || friends.length === 0) return <p> No Friends.</p>;
    
    return(
        <div>
            <h3> Friends </h3>
            {friends.map(friend => (
                <div key={friend._id} className="friend-card">
                    <h3>{friend.name} - {friend.careerGoal}</h3>
                </div>
            ))}
        </div>
    );
}

export default FriendsList;