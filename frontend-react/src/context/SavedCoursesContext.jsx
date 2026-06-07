import { createContext, useContext, useEffect, useState, useCallback } from "react";

const API = "http://localhost:5001/api/users/me/saved-courses";
const MAX_SAVED = 10;

const SavedCoursesContext = createContext(null);

export function useSavedCourses() {
    return useContext(SavedCoursesContext);
}

export function SavedCoursesProvider({ children }) {
    // `saved` is an array of full course objects the user has starred
    const [saved, setSaved] = useState([]);

    const authHeader = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`
    });

    const refresh = useCallback(async () => {
        try {
            const res = await fetch(API, { headers: authHeader() });
            const data = await res.json();
            setSaved(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load saved courses:", error);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const isSaved = useCallback(
        (courseId) => saved.some((c) => c._id === courseId),
        [saved]
    );

    const toggleSave = useCallback(
        async (course) => {
            const alreadySaved = saved.some((c) => c._id === course._id);

            try {
                let res;
                if (alreadySaved) {
                    res = await fetch(`${API}/${course._id}`, {
                        method: "DELETE",
                        headers: authHeader()
                    });
                } else {
                    if (saved.length >= MAX_SAVED) {
                        alert(`You can only save up to ${MAX_SAVED} courses.`);
                        return;
                    }
                    res = await fetch(API, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...authHeader() },
                        body: JSON.stringify({ courseId: course._id })
                    });
                }

                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || "Could not update saved courses.");
                    return;
                }
                setSaved(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to update saved course:", error);
            }
        },
        [saved]
    );

    return (
        <SavedCoursesContext.Provider
            value={{ saved, isSaved, toggleSave, refresh, max: MAX_SAVED }}
        >
            {children}
        </SavedCoursesContext.Provider>
    );
}
