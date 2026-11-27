const apiBase = document.querySelector('meta[name="newsies-api-base"]')?.content
  || window.NEWSIES_API_BASE
  || "";

async function postAuth(path, payload) {
  const response = await fetch(`${apiBase.replace(/\/$/, "")}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }
  if (!response.ok) {
    const message = body.detail || body.message;
    throw new Error(typeof message === "string" ? message : "Authentication request failed.");
  }
  return body;
}

function setNotice(id, message, isError = false) {
  const notice = document.querySelector(id);
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("is-error", isError);
}

const signupForm = document.querySelector("#signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(signupForm);
    const button = signupForm.querySelector("button[type='submit']");
    button.disabled = true;
    setNotice("#signup-notice", "Creating your account…");
    try {
      await postAuth("/v1/auth/signup", {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });
      setNotice("#signup-notice", "Account created. Check your email for a verification link.");
      signupForm.reset();
    } catch (error) {
      setNotice("#signup-notice", error.message, true);
    } finally {
      button.disabled = false;
    }
  });
}

const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(loginForm);
    const button = loginForm.querySelector("button[type='submit']");
    button.disabled = true;
    setNotice("#login-notice", "Signing in…");
    try {
      await postAuth("/v1/auth/login", {
        email: form.get("email"),
        password: form.get("password"),
      });
      window.location.href = "dashboard.html";
    } catch (error) {
      setNotice("#login-notice", error.message, true);
    } finally {
      button.disabled = false;
    }
  });
}
