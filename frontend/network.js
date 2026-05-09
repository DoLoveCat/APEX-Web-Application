// ===============================
// Mock Data
// Later, replace these arrays with backend API responses.
// ===============================

const networkPosts = [
  {
    authorInitials: "MK",
    authorName: "Marcus Kim",
    role: "Mentor",
    meta: "SWE at Stripe · UCR '23 · 2h ago",
    audience: "Mentors",
    text:
      "Quick tip for juniors targeting SWE roles: start building side projects NOW. Your GPA gets you an interview, but your projects get you the offer. Three solid GitHub repos > a 4.0 with no code to show. #SWE #CareerAdvice",
    likes: 84,
    comments: 12,
    hasImage: false
  },
  {
    authorInitials: "JD",
    authorName: "Jasmine Diaz",
    role: "Senior",
    meta: "CS Senior · Full-stack SWE path · 5h ago",
    audience: "Seniors",
    text:
      "Just submitted my final project for CS 110 🎉 Built a full-stack expense tracker with React + Node. If any juniors want to see the repo for reference, DM me!",
    likes: 56,
    comments: 8,
    hasImage: true
  },
  {
    authorInitials: "AR",
    authorName: "Aisha Rahman",
    role: "Student",
    meta: "CS Junior · Frontend path · 8h ago",
    audience: "Students",
    text:
      "Working through React state management this week. The hardest part is not the syntax, but knowing where each piece of data should live.",
    likes: 31,
    comments: 5,
    hasImage: false
  }
];

const suggestedUsers = [
  {
    initials: "RK",
    name: "Ryan Kapoor",
    description: "CS Senior · SWE path"
  },
  {
    initials: "EM",
    name: "Emma Martinez",
    description: "SWE at Airbnb · Mentor"
  },
  {
    initials: "TB",
    name: "Tyler Brown",
    description: "CS Junior · 5 shared courses"
  }
];

const networkPeople = [
  {
    initials: "JD",
    name: "Jasmine Diaz",
    type: "Student",
    description: "CS Senior · Full-stack SWE path · 6 shared courses",
    action: "Connect"
  },
  {
    initials: "MK",
    name: "Marcus Kim",
    type: "Mentor",
    description: "SWE at Stripe · UCR '23 · Mentoring 4 students",
    action: "Message"
  },
  {
    initials: "AR",
    name: "Aisha Rahman",
    type: "Student",
    description: "CS Junior · Frontend path · 4 shared courses",
    action: "Connect"
  },
  {
    initials: "DP",
    name: "Dev Patel",
    type: "Mentor",
    description: "Senior SWE at Google · 10+ yrs experience",
    action: "Message"
  }
];

// ===============================
// Page State
// ===============================

let activeFeedTab = "For You";
let activeNetworkFilter = "All";

// ===============================
// DOM Elements
// ===============================

const feedPage = document.getElementById("feedPage");
const networkListPage = document.getElementById("networkListPage");

const postContainer = document.getElementById("postContainer");
const suggestedUserContainer = document.getElementById("suggestedUserContainer");
const networkPeopleContainer = document.getElementById("networkPeopleContainer");

const openNetworkButton = document.getElementById("openNetworkButton");
const backToFeedButton = document.getElementById("backToFeedButton");

// ===============================
// Feed Tab Logic
// Search keyword: feed tabs
// ===============================

function setupFeedTabs() {
  const feedTabs = document.querySelectorAll(".feed-tab");

  feedTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activeFeedTab = tab.dataset.tab;

      feedTabs.forEach(function (button) {
        button.classList.remove("active");
      });

      tab.classList.add("active");
      renderPosts();
    });
  });
}

// ===============================
// Post Rendering
// Search keyword: post card
// ===============================

function renderPosts() {
  postContainer.innerHTML = "";

  const visiblePosts = networkPosts.filter(function (post) {
    if (activeFeedTab === "For You") {
      return true;
    }

    if (activeFeedTab === "Students") {
      return post.audience === "Students";
    }

    if (activeFeedTab === "Seniors") {
      return post.audience === "Seniors";
    }

    if (activeFeedTab === "Mentors") {
      return post.audience === "Mentors";
    }
  });

  visiblePosts.forEach(function (post) {
    const postCard = document.createElement("article");
    postCard.className = "post-card";

    const imageHtml = post.hasImage
      ? `<div class="post-image-placeholder">📷 Project screenshot</div>`
      : "";

    postCard.innerHTML = `
      <div class="post-header">
        <div class="post-author-left">
          <div class="small-avatar">${post.authorInitials}</div>
          <div>
            <p class="post-author-name">
              ${post.authorName}
              <span class="role-badge">${post.role}</span>
            </p>
            <p class="post-meta">${post.meta}</p>
          </div>
        </div>

        <span class="post-menu">···</span>
      </div>

      <p class="post-text">${post.text}</p>

      ${imageHtml}

      <div class="post-actions">
        <span>♥ ${post.likes} likes</span>
        <span>💬 ${post.comments} comments</span>
        <span>↗ Share</span>
      </div>
    `;

    postContainer.appendChild(postCard);
  });
}

// ===============================
// Suggested Users Rendering
// Search keyword: suggested users
// ===============================

function renderSuggestedUsers() {
  suggestedUserContainer.innerHTML = "";

  suggestedUsers.forEach(function (user) {
    const userRow = document.createElement("div");
    userRow.className = "suggested-user";

    userRow.innerHTML = `
      <div class="suggested-info">
        <div class="small-avatar">${user.initials}</div>
        <div>
          <p class="suggested-name">${user.name}</p>
          <p class="suggested-desc">${user.description}</p>
        </div>
      </div>

      <button class="follow-button">+ Follow</button>
    `;

    suggestedUserContainer.appendChild(userRow);
  });
}

// ===============================
// Your Network Page Logic
// Search keyword: your network
// ===============================

function showNetworkListPage() {
  feedPage.classList.add("hidden");
  networkListPage.classList.remove("hidden");

  // Simulate page navigation for the static version.
  window.location.hash = "your-network";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function showFeedPage() {
  networkListPage.classList.add("hidden");
  feedPage.classList.remove("hidden");

  // Return to the main network feed URL.
  history.pushState(
    "",
    document.title,
    window.location.pathname + window.location.search
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function setupNetworkPageButtons() {
  openNetworkButton.addEventListener("click", showNetworkListPage);
  backToFeedButton.addEventListener("click", showFeedPage);
}

// ===============================
// Network Filter Logic
// Search keyword: network filter
// ===============================

function setupNetworkFilters() {
  const filterButtons = document.querySelectorAll(".network-filter");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeNetworkFilter = button.dataset.filter;

      filterButtons.forEach(function (filterButton) {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");
      renderNetworkPeople();
    });
  });
}

function renderNetworkPeople() {
  networkPeopleContainer.innerHTML = "";

  const visiblePeople = networkPeople.filter(function (person) {
    if (activeNetworkFilter === "All") {
      return true;
    }

    return person.type === activeNetworkFilter;
  });

  visiblePeople.forEach(function (person) {
    const personCard = document.createElement("article");
    personCard.className = "network-person-card";

    const isMessageButton = person.action === "Message";

    personCard.innerHTML = `
      <div class="person-left">
        <div class="person-avatar">${person.initials}</div>

        <div>
          <p class="person-name">
            ${person.name}
            ${person.type === "Mentor" ? '<span class="role-badge">Mentor</span>' : ""}
          </p>

          <p class="person-desc">${person.description}</p>
        </div>
      </div>

      <button class="person-action ${isMessageButton ? "" : "primary"}">
        ${person.action}
      </button>
    `;

    networkPeopleContainer.appendChild(personCard);
  });
}

// ===============================
// Simple Post Button Demo
// Search keyword: post composer
// ===============================

function setupPostComposer() {
  const postInput = document.getElementById("postInput");
  const postButton = document.getElementById("postButton");

  postButton.addEventListener("click", function () {
    const postText = postInput.value.trim();

    if (postText === "") {
      alert("Please write something before posting.");
      return;
    }

    alert("Static demo only. Later this will create a real post through the backend.");
    postInput.value = "";
  });
}

// ===============================
// Page Initialization
// ===============================

function initializeNetworkPage() {
  setupFeedTabs();
  setupNetworkFilters();
  setupNetworkPageButtons();
  setupPostComposer();

  renderPosts();
  renderSuggestedUsers();
  renderNetworkPeople();

  // If the URL has #your-network, open the Your Network page directly.
  if (window.location.hash === "#your-network") {
    feedPage.classList.add("hidden");
    networkListPage.classList.remove("hidden");
  }
}

initializeNetworkPage();