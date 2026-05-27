// ===============================
// Apex Account Menu
// 全站右上角头像菜单组件
// 修改关键词：account menu / login state / profile link
// ===============================

/*
  现在这里用的是前端 mock user。

  之后接后端时：
  1. 可以把 currentUser 改成从 /api/auth/me 拿到的数据
  2. 如果后端返回 401 或 null，就显示未登录状态
  3. 如果后端返回用户资料，就显示头像、名字、major、career path 等
*/

const currentUser = {
  isLoggedIn: true,
  initials: "LN",
  name: "Laiba Nasir",
  major: "CS",
  year: "Junior",
  school: "UCR",
  connections: 47,
  following: 82,
  posts: 12,
  pathTags: ["Software Engineer", "Full-stack", "Web Dev"]
};

/*
  测试未登录状态时，可以暂时改成这样：

  const currentUser = {
    isLoggedIn: false
  };

  后端接入后，这里应该由真实 login session / JWT 判断。
*/

function renderAccountMenu() {
  const accountMenuContainer = document.getElementById("accountMenuContainer");

  if (!accountMenuContainer) {
    return;
  }

  if (!currentUser.isLoggedIn) {
    renderLoggedOutAccountMenu(accountMenuContainer);
    return;
  }

  renderLoggedInAccountMenu(accountMenuContainer);
}

function renderLoggedInAccountMenu(container) {
  const tagHtml = currentUser.pathTags
    .map(function (tag) {
      return `<span>${tag}</span>`;
    })
    .join("");

  container.innerHTML = `
    <div class="apex-account-menu">
      <button id="apexAvatarButton" class="apex-avatar-button">
        ${currentUser.initials}
      </button>

      <div class="apex-account-dropdown">
        <div class="apex-dropdown-avatar">${currentUser.initials}</div>

        <p class="apex-dropdown-name">${currentUser.name}</p>
        <p class="apex-dropdown-subtitle">
          ${currentUser.major} · ${currentUser.year} · ${currentUser.school}
        </p>

        <div class="apex-dropdown-divider"></div>

        <div class="apex-dropdown-stats">
          <div class="apex-dropdown-stat-row">
            <span>Connections</span>
            <strong>${currentUser.connections}</strong>
          </div>

          <div class="apex-dropdown-stat-row">
            <span>Following</span>
            <strong>${currentUser.following}</strong>
          </div>

          <div class="apex-dropdown-stat-row">
            <span>Posts</span>
            <strong>${currentUser.posts}</strong>
          </div>
        </div>

        <div class="apex-dropdown-divider"></div>

        <p class="apex-dropdown-section-title">Your Path</p>

        <div class="apex-dropdown-tags">
          ${tagHtml}
        </div>

        <button id="goToProfileButton" class="apex-dropdown-button primary">
          Go to Your Profile
        </button>

        <button id="settingsButton" class="apex-dropdown-button">
          Settings
        </button>
      </div>
    </div>
  `;

  /*
    点击头像：直接进入 profile.html
    如果之后你们有 React Router，这里会变成 navigate("/profile")
  */
  document.getElementById("apexAvatarButton").addEventListener("click", function () {
    window.location.href = "profile.html";
  });

  /*
    点击 Go to Your Profile：也进入 profile.html
  */
  document.getElementById("goToProfileButton").addEventListener("click", function () {
    window.location.href = "profile.html";
  });

  /*
    Settings 目前先留口。
    后面可以改成：
    window.location.href = "settings.html";
    或者 React 里 navigate("/settings")
  */
  document.getElementById("settingsButton").addEventListener("click", function () {
    alert("Settings page will be added later.");
  });
}

function renderLoggedOutAccountMenu(container) {
  container.innerHTML = `
    <div class="apex-account-menu">
      <button id="guestAvatarButton" class="apex-avatar-button logged-out">
        ?
      </button>

      <div class="apex-account-dropdown">
        <div class="apex-dropdown-avatar">?</div>

        <p class="apex-dropdown-name">Guest User</p>
        <p class="apex-dropdown-subtitle">
          Log in to save your path, courses, and network.
        </p>

        <div class="apex-dropdown-divider"></div>

        <button id="loginButton" class="apex-dropdown-button primary">
          Log in
        </button>

        <button id="signupButton" class="apex-dropdown-button">
          Create account
        </button>
      </div>
    </div>
  `;

  /*
    后面接后端时：
    loginButton 可以跳转到 login.html
    或者打开 React 的 login route
  */
  document.getElementById("loginButton").addEventListener("click", function () {
    alert("Login page will be added later.");
  });

  document.getElementById("signupButton").addEventListener("click", function () {
    alert("Signup page will be added later.");
  });
}

renderAccountMenu();