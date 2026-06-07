import React from "react";

import { useState } from "react";

import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";

export default function Home({ user }) {
    const API_URL = "http://localhost:5001/api/courses";
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [careerGoal, setCareerGoal] = useState("");

    return (
      <div>
          <h1> Home </h1>
          <p className="muted">Enter your career goal to see your recommended courses.</p>

          <CourseForm
            API_URL={API_URL}
            setCourses={setCourses}
            setLoading={setLoading}
            setCareerGoal={setCareerGoal}
            initialGoal={user?.careerGoal}
          />

          {user?.careerGoal && !careerGoal && (
            <p>Your saved career goal: <strong>{user.careerGoal}</strong></p>
          )}

          {loading && <p>Loading recommended courses...</p>}

          {!loading && careerGoal && courses.length > 0 && (
            <>
              <h2>
                {user?.name ? `${user.name}'s` : "Your"} top {courses.length}{" "}
                recommended courses to become a {careerGoal}
              </h2>
              <CourseList courses={courses} />
            </>
          )}

          {!loading && careerGoal && courses.length === 0 && (
            <p>No courses found for "{careerGoal}".</p>
          )}
      </div>
  );
}
