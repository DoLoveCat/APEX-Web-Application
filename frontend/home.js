// ===============================
// Home Page Static Data
// Later, these can be replaced by API data.
// ===============================

const quickCareerTags = [
  {
    icon: "💻",
    name: "Software Engineer"
  },
  {
    icon: "🎨",
    name: "UX Designer"
  },
  {
    icon: "📊",
    name: "Data Scientist"
  },
  {
    icon: "🤖",
    name: "ML Engineer"
  },
  {
    icon: "📈",
    name: "Product Manager"
  }
];

const platformStats = [
  {
    icon: "👥",
    label: "Active Students",
    value: "1,247",
    description: "Across 12 majors"
  },
  {
    icon: "📚",
    label: "Courses Reviewed",
    value: "342",
    description: "2,891 total reviews"
  },
  {
    icon: "💼",
    label: "Job Placement",
    value: "87%",
    description: "CS grads in 6 months"
  },
  {
    icon: "✨",
    label: "AI Queries",
    value: "6,412",
    description: "Career paths generated"
  }
];

const trendingCareerPaths = [
  {
    icon: "💻",
    title: "Software Engineer",
    description:
      "Build full-stack applications, work on technical systems, and solve complex problems with code.",
    students: 328,
    mentors: 12,
    rating: 4.6
  },
  {
    icon: "🎨",
    title: "UX Designer",
    description:
      "Design intuitive user experiences, conduct research, and shape how people interact with products.",
    students: 184,
    mentors: 8,
    rating: 4.7
  },
  {
    icon: "📊",
    title: "Data Scientist",
    description:
      "Analyze data, build models, and turn information into business insights using ML and statistics.",
    students: 241,
    mentors: 10,
    rating: 4.5
  }
];

const recentActivities = [
  {
    initials: "JD",
    text: "Jasmine Diaz reviewed CS 110 · ★★★★★ “Game changer for frontend roles”",
    time: "2 hours ago"
  },
  {
    initials: "MK",
    text: "Marcus Kim shared career advice for the SWE path",
    time: "5 hours ago"
  },
  {
    initials: "AR",
    text: "Aisha Rahman connected with 3 new students on the Frontend path",
    time: "8 hours ago"
  }
];

// ===============================
// Render Functions
// ===============================

function renderQuickCareerTags() {
  const quickTagsContainer = document.getElementById("quickTagsContainer");

  quickCareerTags.forEach(function (career) {
    const tagButton = document.createElement("button");
    tagButton.className = "quick-tag";
    tagButton.textContent = `${career.icon} ${career.name}`;

    tagButton.addEventListener("click", function () {
      const dreamJobInput = document.getElementById("dreamJobInput");
      dreamJobInput.value = career.name;
    });

    quickTagsContainer.appendChild(tagButton);
  });
}

function renderPlatformStats() {
  const statsContainer = document.getElementById("statsContainer");

  platformStats.forEach(function (stat) {
    const statCard = document.createElement("article");
    statCard.className = "stat-card";

    statCard.innerHTML = `
      <div class="stat-icon">${stat.icon}</div>
      <p class="stat-label">${stat.label}</p>
      <p class="stat-value">${stat.value}</p>
      <p class="stat-description">${stat.description}</p>
    `;

    statsContainer.appendChild(statCard);
  });
}

function renderCareerPaths() {
  const careerPathsContainer = document.getElementById("careerPathsContainer");

  trendingCareerPaths.forEach(function (career) {
    const careerCard = document.createElement("article");
    careerCard.className = "career-card";

    careerCard.innerHTML = `
      <div class="career-title-row">
        <span class="career-icon">${career.icon}</span>
        <h4 class="career-title">${career.title}</h4>
      </div>

      <p class="career-description">${career.description}</p>

      <div class="career-meta">
        <span><strong>${career.students}</strong> students</span>
        <span><strong>${career.mentors}</strong> mentors</span>
        <span>★ <strong>${career.rating}</strong></span>
      </div>
    `;

    careerPathsContainer.appendChild(careerCard);
  });
}

function renderRecentActivities() {
  const activityContainer = document.getElementById("activityContainer");

  recentActivities.forEach(function (activity) {
    const activityItem = document.createElement("div");
    activityItem.className = "activity-item";

    activityItem.innerHTML = `
      <div class="activity-avatar">${activity.initials}</div>

      <div>
        <p class="activity-text">${activity.text}</p>
        <p class="activity-time">${activity.time}</p>
      </div>
    `;

    activityContainer.appendChild(activityItem);
  });
}

// ===============================
// Search Button Logic
// ===============================

function setupFindPathButton() {
  const findPathButton = document.getElementById("findPathButton");
  const dreamJobInput = document.getElementById("dreamJobInput");

  findPathButton.addEventListener("click", function () {
    const dreamJob = dreamJobInput.value.trim();

    if (dreamJob === "") {
      alert("Please enter your dream job first.");
      return;
    }

    // Save the user's dream job locally.
    // Later, this can be replaced with API call or backend storage.
    localStorage.setItem("dreamJob", dreamJob);

    // For now, jump to My Path page.
    // Later, this page can read the dreamJob and generate an AI path.
    window.location.href = "mypath.html";
  });
}

// ===============================
// Page Initialization
// ===============================

function initializeHomePage() {
  renderQuickCareerTags();
  renderPlatformStats();
  renderCareerPaths();
  renderRecentActivities();
  setupFindPathButton();
}

initializeHomePage();