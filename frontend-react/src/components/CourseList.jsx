import { useState } from "react";

import { useSavedCourses } from "../context/SavedCoursesContext";

function CourseCard({ course , isAdmin, onEdit, onDelete }) {
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

                {/* Admin buttons */}
                {isAdmin && (
                    <>
                        <button
                            className="btn-admin-edit"
                            onClick={() => onEdit(course)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn-admin-delete"
                            onClick={() => onDelete(course._id)}
                        >
                            Delete
                        </button>
                    </>
                )}

                {/* Save button for students */}
                {saveCtx && !isAdmin && (
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
                    {course.crn && <p><strong>CRN:</strong> {course.crn}</p>}
                    <p>{course.description}</p>
                </div>
            )}
        </div>
    );
}

function CourseList({ courses , isAdmin, onEdit, onDelete }) {
    if (!Array.isArray(courses) || courses.length === 0) return <p>No courses found.</p>;

    return (
        <div>
            {courses.map((course) => (
                <CourseCard
                    key={course._id}
                    course={course}
                    isAdmin={isAdmin}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default CourseList;
