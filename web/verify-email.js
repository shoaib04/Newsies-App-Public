const status = document.querySelector("#verification-status");
const token = new URLSearchParams(window.location.search).get("token");
const apiBase = document.querySelector('meta[name="newsies-api-base"]')?.content
  || window.NEWSIES_API_BASE
  || "";

async function verify() {
  if (!token) {
    status.textContent = "The verification link is missing or invalid.";
    return;
  }
  try {
    const response = await fetch(`${apiBase.replace(/\/$/, "")}/v1/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      status.textContent = "This verification link is invalid or has expired.";
      return;
    }
    status.textContent = "Email verified. You can now log in.";
  } catch {
    status.textContent = "Verification is temporarily unavailable.";
  }
}

verify();
