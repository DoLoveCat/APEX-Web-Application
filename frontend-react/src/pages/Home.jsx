import React from "react";

import { useState } from "react";

import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";

export default function Home() {
    const API_URL = "http://localhost:5000/api/courses";
    const [courses, setCourses] = useState([]);
    
    //return <h2> Home Page</h2>;
    
    return (
      <div>
          <h1> Home </h1>
          <CourseForm
            API_URL={API_URL}
            setCourses={setCourses}
          />
          <CourseList
            courses={courses}
          />
      </div>
  );
}