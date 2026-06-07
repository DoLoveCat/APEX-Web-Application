import { useState } from "react";

function CourseForm ({
    API_URL,
    setCourses,
    setLoading,
    setCareerGoal,
    initialGoal
}) {
    const [searchTerm, setSearchTerm] = useState(initialGoal || "");

    async function handleSearch(event) {
        event.preventDefault();

        if (!searchTerm.trim()) return;

        setLoading(true);
        setCareerGoal(searchTerm);

        const authHeader = {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };

        try {
            const embedResponse = await fetch(`${API_URL}/embed?q=${encodeURIComponent(searchTerm)}`, {
                headers: authHeader
            });

            const { embedding } = await embedResponse.json();

            // 2. Use embedding for both at the same time
            const [response] = await Promise.all([
                fetch(`${API_URL}/semantic`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeader },
                    body: JSON.stringify({ embedding })
                }),
                fetch("http://localhost:5001/api/users/career-goal", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", ...authHeader },
                    body: JSON.stringify({ careerGoal: searchTerm, embedding })
                })
            ]);

            const data = await response.json();
            console.log("Data received:", data);
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Search failed:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="search-form" onSubmit={handleSearch}>

            <input
                className="search-input"
                type="text"
                placeholder="Enter your career goal (e.g. software engineer)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button className="btn-primary" type="submit"> Get Recommendations </button>

        </form>
    );
}

export default CourseForm;