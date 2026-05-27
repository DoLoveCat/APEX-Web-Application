// ===============================
// Profile Page Logic
// 修改关键词：profile data / profile activity / backend profile API
// ===============================

/*
  目前这里是静态 profile activity。

  后面接后端时：
  1. 这里可以从 GET /api/users/me/profile 获取当前用户资料
  2. 也可以从 GET /api/users/me/activity 获取用户最近活动
  3. Edit Profile 按钮可以跳到 settings.html 或打开编辑表单
*/

const profileActivities = [
  {
    title: "Saved CS 110 to your course plan",
    time: "2 hours ago"
  },
  {
    title: "Viewed Software Engineer career path",
    time: "1 day ago"
  },
  {
    title: "Connected with Marcus Kim",
    time: "3 days ago"
  }
];

function renderProfileActivities() {
  const activityContainer = document.getElementById("profileActivityContainer");

  if (!activityContainer) {
    return;
  }

  activityContainer.innerHTML = "";

  profileActivities.forEach(function (activity) {
    const activityRow = document.createElement("div");
    activityRow.className = "activity-row";

    activityRow.innerHTML = `
      <p class="activity-title">${activity.title}</p>
      <p class="activity-time">${activity.time}</p>
    `;

    activityContainer.appendChild(activityRow);
  });
}

function setupProfileButtons() {
  const editProfileButton = document.querySelector(".edit-profile-button");
  const actionButtons = document.querySelectorAll(".profile-action-button");

  if (editProfileButton) {
    editProfileButton.addEventListener("click", function () {
      alert("Edit profile will connect to backend later.");
    });
  }

  actionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      alert("This profile action will be connected later.");
    });
  });
}

function initializeProfilePage() {
  renderProfileActivities();
  setupProfileButtons();
}

initializeProfilePage();