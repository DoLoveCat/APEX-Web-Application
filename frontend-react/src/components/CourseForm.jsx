import { useState } from "react";

function CourseForm ({
    API_URL,
    setCourses
}) {
    const [searchTerm, setSearchTerm] = useState("");

    async function handleSearch(event) {
        event.preventDefault();

        const embedResponse = await fetch(`${API_URL}/embed?q=${searchTerm}`, {
        credentials: "include"
        });

        const { embedding } = await embedResponse.json();

        // const response = await fetch (`${API_URL}/semantic?q=${searchTerm}`, {
        // credentials: "include"  // add this
        // });

        // 2. Use embedding for both at the same time
        const [response] = await Promise.all([
            fetch(`${API_URL}/semantic`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ embedding })
            }),
            fetch("http://localhost:5000/api/users/career-goal", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ careerGoal: searchTerm, embedding })
            })
        ]);

        const data = await response.json();
        console.log("Data received:", data);
        setCourses(data);
    }

    return (
        <form onSubmit={handleSearch}>

            <input
                type="text"
                placeholder="Search for courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button type="submit"> Search </button>

        </form>
    );
}

export default CourseForm;