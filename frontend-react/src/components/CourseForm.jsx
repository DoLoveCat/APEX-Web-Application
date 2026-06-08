import { useEffect, useState } from "react";

function CourseForm({
    API_URL,
    loadCourses,
    editingCourse,
    setEditingCourse
}) {
    const [formData, setFormData] = useState({
        subject: "",
        courseNumber: "",
        title: "",
        description: "",
        crn: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingCourse) {
            setFormData({
                subject: editingCourse.subject || "",
                courseNumber: editingCourse.courseNumber || "",
                title: editingCourse.title || "",
                description: editingCourse.description || "",
                term: editingCourse.term || "",
                crn: editingCourse.crn || ""
            });
        }
    }, [editingCourse]);

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (editingCourse) {

            await fetch (`${API_URL}/${editingCourse._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            setEditingCourse(null);

        } else {

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const message = await response.json();
                setError(message.error);
                return;
            }
        }

        setFormData({
            subject: "",
            courseNumber: "",
            title: "",
            description: "",
            term: "",
            crn: ""
        });

        setError("");
        loadCourses();
    }

    return (
        <div className="admin-course-form">
            <form onSubmit={handleSubmit}>
                
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject (e.g. CS)"
                    value={formData.subject}
                    onChange={handleChange}
                />


                <input
                    type="text"
                    name="courseNumber"
                    placeholder="Course Number (e.g. 110)"
                    value={formData.courseNumber}
                    onChange={handleChange}
                />


                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                />


                <input
                    type="text"
                    name="crn"
                    placeholder="CRN"
                    value={formData.crn}
                    onChange={handleChange}
                />


                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                />


                <button type="submit">
                    {editingCourse ? "Update Course" : "Add Course"}
                </button>

                <p className="error">
                    {error === "" ? "" : error}
                </p>

            </form>
        </div>
    )
}

export default CourseForm;