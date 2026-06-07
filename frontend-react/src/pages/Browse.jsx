import React from "react";

import { useEffect, useState } from "react";

import CourseList from "../components/CourseList";

export default function Browse() {
    const API_URL = "http://localhost:5001/api/courses";
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    async function loadCourses(term) {
        setLoading(true);
        try {
            // Empty search -> the whole catalog; otherwise keyword search
            const url = term.trim()
                ? `${API_URL}/search?q=${encodeURIComponent(term)}`
                : API_URL;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load courses:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }

    // Debounce so we don't fire a request on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            loadCourses(searchTerm);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    return (
        <div>
            <h2>Browse Courses</h2>

            <input
                className="search-input"
                type="text"
                placeholder="Search Course name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading && <p>Loading...</p>}

            <CourseList courses={courses} />
        </div>
    );
}
