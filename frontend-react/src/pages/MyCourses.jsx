import React from "react";

import CourseList from "../components/CourseList";
import { useSavedCourses } from "../context/SavedCoursesContext";

export default function MyCourses() {
    const { saved, max } = useSavedCourses();

    return (
        <div>
            <h2>My Courses ({saved.length}/{max})</h2>
            <p>Courses you've starred. You can save up to {max}.</p>

            {saved.length >= max && (
                <p style={{ color: "crimson" }}>
                    You've reached the maximum of {max} saved courses. Remove one to add another.
                </p>
            )}

            <CourseList courses={saved} />
        </div>
    );
}
