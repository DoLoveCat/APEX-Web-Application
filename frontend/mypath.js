// ===============================
// Mock AI Path Data
// Later, replace this object with the response from your AI path API.
// ===============================

const myPathData = {
  recommendedCourses: [
    {
      title: "CS 141 · Data Structures & Algorithms",
      description: "Essential for SWE interviews and technical problem solving."
    },
    {
      title: "CS 110 · Web Development",
      description: "Build practical full-stack foundations for real-world apps."
    },
    {
      title: "CS 166 · Databases",
      description: "Learn how production systems store and query data."
    },
    {
      title: "CS 164 · Computer Networks",
      description: "Understand how distributed applications communicate."
    },
    {
      title: "CS 153 · Operating Systems",
      description: "Core CS foundation for backend and systems engineering."
    }
  ],

  futureSkills: [
    {
      title: "System Design Intuition",
      description: "Architect complex systems and reason about tradeoffs."
    },
    {
      title: "Stakeholder Communication",
      description: "Translate technical decisions to non-technical people."
    },
    {
      title: "Creative Debugging",
      description: "Diagnose bugs in messy codebases where AI may not have context."
    },
    {
      title: "Team Leadership",
      description: "Mentor juniors and help teams make coordinated decisions."
    },
    {
      title: "Ethical Judgment",
      description: "Decide what should be built, not just what can be built."
    }
  ],

  aiTools: [
    {
      title: "GitHub Copilot",
      description: "Use for faster boilerplate code and autocomplete assistance."
    },
    {
      title: "Claude / ChatGPT",
      description: "Plan architecture, review edge cases, and explain unfamiliar code."
    },
    {
      title: "Perplexity",
      description: "Research technical topics and compare current tools."
    },
    {
      title: "NotebookLM",
      description: "Summarize technical docs and extract repeated concepts."
    },
    {
      title: "v0 / Bolt",
      description: "Prototype UI quickly before refining your own frontend code."
    }
  ]
};

// ===============================
// Generic List Renderer
// Search keyword: path item renderer
// ===============================

function renderPathItems(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(function (item, index) {
    const pathItem = document.createElement("div");
    pathItem.className = "path-item";

    pathItem.innerHTML = `
      <div class="item-number">${index + 1}</div>

      <div>
        <p class="item-title">${item.title}</p>
        <p class="item-description">${item.description}</p>
      </div>
    `;

    container.appendChild(pathItem);
  });
}

// ===============================
// Page Initialization
// ===============================

function initializeMyPathPage() {
  renderPathItems("recommendedCoursesContainer", myPathData.recommendedCourses);
  renderPathItems("futureSkillsContainer", myPathData.futureSkills);
  renderPathItems("aiToolsContainer", myPathData.aiTools);
}

initializeMyPathPage();