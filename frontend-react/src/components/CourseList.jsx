function CourseList({ courses }) {
    if (!Array.isArray(courses) || courses.length === 0) return <p>No courses found.</p>;
    
    return(
        <div>
            {courses.map(course => (
                <div key={course._id} className="course-card">
                    <h3>{course.subject}{course.courseNumber} - {course.title}</h3>
                    <p>{course.description}</p>
                </div>
            ))}
        </div>
    );
}

export default CourseList;