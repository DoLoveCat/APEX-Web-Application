import React from "react";

import { useEffect, useState } from "react";

import CourseList from "../components/CourseList";

export default function Browse() {
    const API_URL = "http://localhost:5000/api/courses";
    const [courses, setCourses] = useState([]);

    async function loadCourses() {
        const response = await fetch(API_URL, {
            credentials: "include"
        });

        const data = await response.json();
        console.log("Browse data:", data);
        setCourses(Array.isArray(data) ? data : []);
    }

    useEffect(() => {
        loadCourses();
    }, []);
    
    return (
        <div>
            <h2>Browse Courses</h2>
            <CourseList
            courses={courses}
            />
        </div>
    );
}