// ===============================
// Static Course Data
// Later, this data can be replaced by backend API responses.
// ===============================

const courseList = [
  {
    code: "CS 141",
    name: "Data Structures & Algorithms",
    professor: "Prof. Tamar Shinar",
    category: "Computer Science",
    rating: 4.7,
    reviews: 132,
    careerRelevance: 4.9,
    difficulty: 4.2,
    professorRating: 4.6,
    tags: ["High Relevance", "Challenging", "Popular"],
    description:
      "Covers intermediate data structures and algorithmic problem solving. Useful for technical interviews, software engineering, and advanced CS courses.",
    detailAvailable: false
  },
  {
    code: "CS 110",
    name: "Introduction to Web Development",
    professor: "Prof. Stefano Lonardi",
    category: "Computer Science",
    rating: 4.6,
    reviews: 87,
    careerRelevance: 4.8,
    difficulty: 3.5,
    professorRating: 4.7,
    tags: ["High Relevance", "Popular"],
    description:
      "A practical web development course that introduces students to web applications, frontend and backend development concepts, and modern web project workflows.",
    detailAvailable: true,
    reviewsList: [
      {
        initials: "JD",
        name: "Jasmine Diaz",
        role: "Senior",
        rating: 5.0,
        text:
          "Super practical for a frontend role. The final project was basically my portfolio piece."
      },
      {
        initials: "MK",
        name: "Marcus Kim",
        role: "Alumni",
        rating: 4.5,
        text:
          "Solid foundation. Use what you learn here for internship projects — interviewers love seeing real web apps."
      }
    ]
  },
  {
    code: "CS 166",
    name: "Database Management Systems",
    professor: "Prof. Vagelis Hristidis",
    category: "Computer Science",
    rating: 4.5,
    reviews: 64,
    careerRelevance: 4.7,
    difficulty: 3.8,
    professorRating: 4.4,
    tags: ["High Relevance", "Moderate"],
    description:
      "Introduces relational databases, SQL, query processing, schema design, and database application development.",
    detailAvailable: false
  },
  {
    code: "CS 153",
    name: "Operating Systems",
    professor: "Prof. Nael Abu-Ghazaleh",
    category: "Computer Science",
    rating: 4.4,
    reviews: 98,
    careerRelevance: 4.6,
    difficulty: 4.6,
    professorRating: 4.3,
    tags: ["Challenging", "Popular"],
    description:
      "Covers operating system concepts including processes, threads, scheduling, memory, file systems, and synchronization.",
    detailAvailable: false
  },
  {
    code: "CS 120B",
    name: "Intro to Embedded Systems",
    professor: "Prof. Frank Vahid",
    category: "Computer Science",
    rating: 4.2,
    reviews: 76,
    careerRelevance: 4.1,
    difficulty: 4.0,
    professorRating: 4.2,
    tags: ["Challenging"],
    description:
      "Introduces embedded systems, microcontrollers, hardware/software interaction, and state-machine based design.",
    detailAvailable: false
  },
  {
    code: "MATH 131",
    name: "Linear Algebra",
    professor: "Prof. Yat Tin Chow",
    category: "Mathematics",
    rating: 4.3,
    reviews: 54,
    careerRelevance: 4.4,
    difficulty: 3.7,
    professorRating: 4.3,
    tags: ["High Relevance"],
    description:
      "Covers vectors, matrices, linear transformations, eigenvalues, eigenvectors, and applications in computation and data science.",
    detailAvailable: false
  }
];

// ===============================
// Tag Filter Data
// Add new categories here when the project supports more departments.
// ===============================

const categoryFilters = [
  "All",
  "Computer Science",
  "Mathematics",
  "Engineering",
  "Business",
  "Design"
];

// ===============================
// Global Page State
// These variables track the current search, filter, and sort settings.
// ===============================

let activeCategory = "All";
let currentSearchText = "";
let currentSortType = "careerRelevance";
let currentMinimumRating = 0;

// ===============================
// DOM Elements
// ===============================

const courseListPage = document.getElementById("courseListPage");
const courseDetailPage = document.getElementById("courseDetailPage");

const courseSearchInput = document.getElementById("courseSearchInput");
const sortSelect = document.getElementById("sortSelect");
const ratingSelect = document.getElementById("ratingSelect");

const categoryFilterContainer = document.getElementById("categoryFilterContainer");
const courseCardContainer = document.getElementById("courseCardContainer");
const courseResultText = document.getElementById("courseResultText");
const emptyState = document.getElementById("emptyState");

const backToCoursesButton = document.getElementById("backToCoursesButton");

// ===============================
// Tag Filter Rendering
// This section creates the category filter buttons.
// Search keyword: tag filter
// ===============================

function renderCategoryFilters() {
  categoryFilterContainer.innerHTML = "";

  categoryFilters.forEach(function (categoryName) {
    const filterButton = document.createElement("button");
    filterButton.className = "category-filter-button";
    filterButton.textContent = categoryName;

    if (categoryName === activeCategory) {
      filterButton.classList.add("active");
    }

    filterButton.addEventListener("click", function () {
      activeCategory = categoryName;
      renderCategoryFilters();
      renderCourseCards();
    });

    categoryFilterContainer.appendChild(filterButton);
  });
}

// ===============================
// Course Filtering
// Search keyword: course search
// Search keyword: tag filter
// ===============================

function getFilteredCourses() {
  return courseList.filter(function (course) {
    const courseText = `
      ${course.code}
      ${course.name}
      ${course.professor}
      ${course.category}
      ${course.tags.join(" ")}
    `.toLowerCase();

    const matchesSearch = courseText.includes(currentSearchText.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;

    const matchesMinimumRating = course.rating >= currentMinimumRating;

    return matchesSearch && matchesCategory && matchesMinimumRating;
  });
}

// ===============================
// Course Sorting
// Search keyword: sort courses
// ===============================

function sortCourses(courses) {
  const sortedCourses = [...courses];

  if (currentSortType === "careerRelevance") {
    sortedCourses.sort(function (a, b) {
      return b.careerRelevance - a.careerRelevance;
    });
  }

  if (currentSortType === "ratingHighToLow") {
    sortedCourses.sort(function (a, b) {
      return b.rating - a.rating;
    });
  }

  if (currentSortType === "difficultyLowToHigh") {
    sortedCourses.sort(function (a, b) {
      return a.difficulty - b.difficulty;
    });
  }

  if (currentSortType === "mostReviews") {
    sortedCourses.sort(function (a, b) {
      return b.reviews - a.reviews;
    });
  }

  if (currentSortType === "courseCode") {
    sortedCourses.sort(function (a, b) {
      return a.code.localeCompare(b.code);
    });
  }

  return sortedCourses;
}

// ===============================
// Course Card Rendering
// Search keyword: course cards
// ===============================

function renderCourseCards() {
  const filteredCourses = getFilteredCourses();
  const sortedCourses = sortCourses(filteredCourses);

  courseCardContainer.innerHTML = "";

  courseResultText.textContent = `Showing ${sortedCourses.length} course${
    sortedCourses.length === 1 ? "" : "s"
  }`;

  if (sortedCourses.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  sortedCourses.forEach(function (course) {
    const courseCard = document.createElement("article");
    courseCard.className = "course-card";

    const tagHtml = course.tags
      .map(function (tag) {
        return `<span class="course-tag">${tag}</span>`;
      })
      .join("");

    const buttonClass = course.detailAvailable
      ? "view-course-button"
      : "view-course-button disabled";

    const buttonText = course.detailAvailable
      ? "View course"
      : "Coming soon";

    courseCard.innerHTML = `
      <div>
        <div class="course-card-top">
          <div>
            <p class="course-code">${course.code}</p>
            <h3 class="course-title">${course.name}</h3>
            <p class="course-professor">${course.professor}</p>
          </div>

          <p class="course-rating">★ ${course.rating}</p>
        </div>

        <div class="course-tag-row">
          ${tagHtml}
        </div>
      </div>

      <div class="course-card-bottom">
        <p class="review-count">${course.reviews} reviews</p>
        <button class="${buttonClass}" data-course-code="${course.code}">
          ${buttonText}
        </button>
      </div>
    `;

    courseCardContainer.appendChild(courseCard);
  });

  setupViewCourseButtons();
}

// ===============================
// Course Detail View
// For now, only CS 110 has a detail page example.
// Search keyword: course detail
// ===============================

function setupViewCourseButtons() {
  const viewCourseButtons = document.querySelectorAll(".view-course-button");

  viewCourseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const courseCode = button.dataset.courseCode;
      const selectedCourse = findCourseByCode(courseCode);

      if (!selectedCourse || !selectedCourse.detailAvailable) {
        return;
      }

      showCourseDetail(selectedCourse);
    });
  });
}

function findCourseByCode(courseCode) {
  return courseList.find(function (course) {
    return course.code === courseCode;
  });
}

function showCourseDetail(course) {
  courseListPage.classList.add("hidden");
  courseDetailPage.classList.remove("hidden");

  document.getElementById("detailCourseMeta").textContent =
    `${course.code} · UC Riverside`;

  document.getElementById("detailCourseTitle").textContent = course.name;

  document.getElementById("detailCourseRating").textContent =
    `★ ${course.rating}`;

  document.getElementById("detailCourseReviews").textContent =
    `${course.reviews} reviews`;

  document.getElementById("detailCourseProfessor").textContent =
    course.professor;

  document.getElementById("detailCareerRelevance").textContent =
    `${course.careerRelevance} ★`;

  document.getElementById("detailDifficulty").textContent =
    `${course.difficulty} ★`;

  document.getElementById("detailProfessorRating").textContent =
    `${course.professorRating} ★`;

  document.getElementById("detailCourseDescription").textContent =
    course.description;

  renderCourseReviews(course);

  window.location.hash = "cs110";
  window.scrollTo(0, 0);
}

function renderCourseReviews(course) {
  const reviewContainer = document.getElementById("reviewContainer");
  reviewContainer.innerHTML = "";

  if (!course.reviewsList || course.reviewsList.length === 0) {
    reviewContainer.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  course.reviewsList.forEach(function (review) {
    const reviewCard = document.createElement("article");
    reviewCard.className = "review-card";

    reviewCard.innerHTML = `
      <div class="review-avatar">${review.initials}</div>

      <div>
        <div class="review-name-row">
          <span class="review-name">${review.name}</span>
          <span class="review-meta">· ${review.role}</span>
          <span class="review-meta">· ★ ${review.rating}</span>
        </div>

        <p class="review-text">${review.text}</p>
      </div>
    `;

    reviewContainer.appendChild(reviewCard);
  });
}

function showCourseList() {
  courseDetailPage.classList.add("hidden");
  courseListPage.classList.remove("hidden");

  history.pushState(
    "",
    document.title,
    window.location.pathname + window.location.search
  );

  window.scrollTo(0, 0);
}

// ===============================
// Event Listeners
// Search keyword: page events
// ===============================

function setupPageEvents() {
  courseSearchInput.addEventListener("input", function () {
    currentSearchText = courseSearchInput.value.trim();
    renderCourseCards();
  });

  sortSelect.addEventListener("change", function () {
    currentSortType = sortSelect.value;
    renderCourseCards();
  });

  ratingSelect.addEventListener("change", function () {
    currentMinimumRating = Number(ratingSelect.value);
    renderCourseCards();
  });

  backToCoursesButton.addEventListener("click", function () {
    showCourseList();
  });
}

// ===============================
// Page Initialization
// Search keyword: page initialization
// ===============================

function initializeCoursesPage() {
  renderCategoryFilters();
  renderCourseCards();
  setupPageEvents();

  if (window.location.hash === "#cs110") {
    const cs110Course = findCourseByCode("CS 110");

    if (cs110Course) {
      showCourseDetail(cs110Course);
    }
  }
}

initializeCoursesPage();