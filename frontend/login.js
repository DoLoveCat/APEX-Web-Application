// Backend endpoint defined in backend/routes/auth.routes.js
const API_URL = 'http://localhost:3000/api/auth/login';

// Grab references to the form, submit button, and error <p> once at load time
const form = document.getElementById('login-form');
const submitBtn = document.getElementById('submit-btn');
const errorEl = document.getElementById('error-message');

// Helpers to show/hide the inline error message under the form
function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError() {
  errorEl.textContent = '';
  errorEl.hidden = true;
}

// Run when the user submits the form
form.addEventListener('submit', async (event) => {
  // Stop the browser's default "navigate to form action" behavior — we handle it via fetch
  event.preventDefault();
  clearError();

  // Read current values out of the form fields
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Client-side guard so we don't bother the server with obviously empty input
  if (!email || !password) {
    showError('Please enter both email and password.');
    return;
  }

  // Disable the button so a slow network can't cause double-submits
  submitBtn.disabled = true;

  try {
    // POST the credentials as JSON to the login endpoint
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // Parse the JSON body; .catch handles the case where the server returned non-JSON
    const data = await response.json().catch(() => ({}));

    // response.ok is true for 2xx status codes. 401 (wrong password) lands here with data.error set
    if (!response.ok) {
      showError(data.error || 'Login failed. Please try again.');
      return;
    }

    // Success: persist the JWT and user info so other pages can read them
    // localStorage survives page reloads and tab closes (until the user clears it)
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Send the now-logged-in user to the home page
    window.location.href = 'home.html';
  } catch (err) {
    // fetch only rejects on network-level failures (server down, CORS, offline, etc.)
    showError('Could not reach the server. Please try again.');
  } finally {
    // Re-enable the button whether we succeeded, errored, or threw
    submitBtn.disabled = false;
  }
});
