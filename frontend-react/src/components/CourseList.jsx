import { useState } from "react";

import { useSavedCourses } from "../context/SavedCoursesContext";

function CourseCard({ course }) {
    const [expanded, setExpanded] = useState(false);
    const saveCtx = useSavedCourses();

    // Units are embedded at the start of the description, e.g. "4 Units, Lecture, ..."
    const unitsMatch = course.description && course.description.match(/([\d.]+)\s*Units?/i);

    const saved = saveCtx ? saveCtx.isSaved(course._id) : false;
    const atLimit = saveCtx ? !saved && saveCtx.saved.length >= saveCtx.max : false;

    return (
        <div className="course-card">
            <div className="course-card-header">
                <h3
                    className="course-title"
                    onClick={() => setExpanded((e) => !e)}
                >
                    <span className="expand-arrow">{expanded ? "▾" : "▸"}</span>
                    {course.subject}{course.courseNumber} - {course.title}
                </h3>

                {saveCtx && (
                    <button
                        className={`save-star ${saved ? "saved" : ""}`}
                        onClick={() => saveCtx.toggleSave(course)}
                        disabled={atLimit}
                        title={
                            atLimit
                                ? `Limit of ${saveCtx.max} saved courses reached`
                                : saved
                                ? "Remove from My Courses"
                                : "Save to My Courses"
                        }
                    >
                        {saved ? "★" : "☆"}
                    </button>
                )}
            </div>

            {expanded && (
                <div className="course-details">
                    {unitsMatch && <p><strong>Units:</strong> {unitsMatch[1]}</p>}
                    {course.term && <p><strong>Term:</strong> {course.term}</p>}
                    {course.crn && <p><strong>CRN:</strong> {course.crn}</p>}
                    <p>{course.description}</p>
                </div>
            )}
        </div>
    );
}

function CourseList({ courses }) {
    if (!Array.isArray(courses) || courses.length === 0) return <p>No courses found.</p>;

    return (
        <div>
            {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
            ))}
        </div>
    );
}

export default CourseList;
