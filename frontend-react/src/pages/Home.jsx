import { useEffect, useState } from "react";

import CourseList from "../components/CourseList";

const API_URL = "http://localhost:5001/api/courses";

const SUGGESTIONS = [
    "Software Engineer",
    "Doctor",
    "Data Scientist",
    "Nurse",
    "Lawyer",
    "Teacher",
    "Accountant"
];

const COUNT_OPTIONS = [5, 10, 15];

export default function Home({ user }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [careerGoal, setCareerGoal] = useState("");
    const [searchTerm, setSearchTerm] = useState(user?.careerGoal || "");
    const [count, setCount] = useState(10);

    async function runSearch(goal) {
        const term = (goal ?? searchTerm).trim();
        if (!term) return;

        setSearchTerm(term);
        setCareerGoal(term);
        setLoading(true);

        const authHeader = {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };

        try {
            const embedResponse = await fetch(
                `${API_URL}/embed?q=${encodeURIComponent(term)}`,
                { headers: authHeader }
            );
            const { embedding } = await embedResponse.json();

            const [response] = await Promise.all([
                fetch(`${API_URL}/semantic`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeader },
                    body: JSON.stringify({ embedding })
                }),
                fetch("http://localhost:5001/api/users/career-goal", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", ...authHeader },
                    body: JSON.stringify({ careerGoal: term, embedding })
                })
            ]);

            const data = await response.json();
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Search failed:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }

    // auto-load recommendations for a returning user's saved goal
    useEffect(() => {
        if (user?.careerGoal) runSearch(user.careerGoal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.careerGoal]);

    function handleSubmit(e) {
        e.preventDefault();
        runSearch();
    }

    const firstName = user?.name ? user.name.split(/\s+/)[0] : null;
    const visibleCourses = courses.slice(0, count);

    return (
        <div className="home">
            <section className="home-hero">
                <h1 className="home-greeting">
                    {firstName ? `Welcome back, ${firstName}` : "Welcome"} 👋
                </h1>
                <p className="home-sub">
                    Tell us your career goal and we'll map out the courses to get
                    you there.
                </p>

                <form className="home-search" onSubmit={handleSubmit}>
                    <span className="home-search-icon">🔍</span>
                    <input
                        className="home-search-input"
                        type="text"
                        placeholder="Enter your career goal (e.g. software engineer)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-primary" type="submit">
                        Get Recommendations
                    </button>
                </form>

                <div className="home-chips">
                    <span className="home-chips-label">Popular:</span>
                    {SUGGESTIONS.map((s) => (
                        <button
                            key={s}
                            type="button"
                            className="chip"
                            onClick={() => runSearch(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </section>

            {loading && (
                <div className="course-skeletons">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton-card" />
                    ))}
                </div>
            )}

            {!loading && careerGoal && courses.length > 0 && (
                <section className="home-results">
                    <div className="home-results-head">
                        <h2 className="home-results-title">
                            Top courses to become a{" "}
                            <span className="goal-text">{careerGoal}</span>
                        </h2>
                        <div className="count-toggle">
                            {COUNT_OPTIONS.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    className={`count-btn ${
                                        count === n ? "active" : ""
                                    }`}
                                    onClick={() => setCount(n)}
                                >
                                    Top {n}
                                </button>
                            ))}
                        </div>
                    </div>
                    <CourseList courses={visibleCourses} />
                </section>
            )}

            {!loading && careerGoal && courses.length === 0 && (
                <div className="home-empty">
                    <div className="home-empty-icon">🎯</div>
                    <p>
                        No courses found for "<strong>{careerGoal}</strong>". Try a
                        different goal.
                    </p>
                </div>
            )}

            {!loading && !careerGoal && (
                <div className="home-empty">
                    <div className="home-empty-icon">🧭</div>
                    <p className="muted">
                        Search a career goal above to see your personalized course
                        recommendations.
                    </p>
                </div>
            )}
        </div>
    );
}
