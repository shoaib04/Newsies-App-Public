const copyButton = document.querySelector("#copy-curl");
const newKeyButton = document.querySelector("#new-key-button");
const apiBase = document.querySelector('meta[name="newsies-api-base"]')?.content
  || window.NEWSIES_API_BASE
  || "";

function updateAccount(account) {
  const name = document.querySelector("#dashboard-name");
  const email = document.querySelector("#dashboard-email");
  const avatar = document.querySelector("#dashboard-avatar");
  const status = document.querySelector("#session-status");
  const logoutButton = document.querySelector("#logout-button");

  if (name) name.textContent = account.name;
  if (email) email.textContent = account.email;
  if (avatar) {
    avatar.textContent = account.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }
  if (status) status.textContent = "SESSION ACTIVE";
  if (logoutButton) logoutButton.disabled = false;
}

async function loadAccount() {
  const status = document.querySelector("#session-status");
  try {
    const response = await fetch(`${apiBase.replace(/\/$/, "")}/v1/auth/me`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (response.status === 401) {
      window.location.replace("login.html");
      return;
    }

    async function loadAccountData() {
      try {
        const [keysResponse, usageResponse] = await Promise.all([
          fetch(`${apiBase.replace(/\/$/, "")}/v1/account/keys`, {
            credentials: "include",
            headers: { Accept: "application/json" },
          }),
          fetch(`${apiBase.replace(/\/$/, "")}/v1/account/usage`, {
            credentials: "include",
            headers: { Accept: "application/json" },
          }),
        ]);
        if (keysResponse.ok) {
          const keys = await keysResponse.json();
          const keyList = document.querySelector("#key-list");
          if (keyList) {
            keyList.replaceChildren();
            if (!keys.length) {
              const empty = document.createElement("small");
              empty.textContent = "No API keys for this account.";
              keyList.appendChild(empty);
            } else {
              keys.forEach((key) => {
                const row = document.createElement("div");
                row.className = "key-row";
                row.innerHTML = `
                  <div class="key-name"><strong></strong><small></small></div>
                  <span class="key-state"><i></i><span></span></span>
                `;
                row.querySelector("strong").textContent = key.label;
                row.querySelector("small").textContent = key.key_prefix;
                row.querySelector(".key-state span").textContent =
                  key.status === "active" ? "Active" : "Revoked";
                keyList.appendChild(row);
              });
            }
          }
        }
        if (usageResponse.ok) {
          const usage = await usageResponse.json();
          const total = document.querySelector("#usage-total");
          const successful = document.querySelector("#usage-successful");
          if (total) total.textContent = usage.total_requests;
          if (successful) successful.textContent = usage.successful_requests;
        }
      } catch {
        const keyList = document.querySelector("#key-list");
        if (keyList) keyList.textContent = "Account data unavailable.";
      }
    }
    if (!response.ok) throw new Error("Account unavailable");
    updateAccount(await response.json());
  } catch {
    if (status) status.textContent = "SESSION UNAVAILABLE";
    const name = document.querySelector("#dashboard-name");
    const email = document.querySelector("#dashboard-email");
    if (name) name.textContent = "Account unavailable";
    if (email) email.textContent = "Sign in to continue";
  }
}

document.querySelector("#logout-button")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await fetch(`${apiBase.replace(/\/$/, "")}/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    window.location.replace("login.html");
  }
});

loadAccount();
loadAccountData();

copyButton?.addEventListener("click", async () => {
  const curl = 'curl -H "X-API-Key: nws_preview_key_not_for_use" "https://api.example.invalid/v1/articles?q=technology&limit=10"';
  try {
    await navigator.clipboard.writeText(curl);
  } catch {
    return;
  }
  copyButton.textContent = "Copied ✓";
  window.setTimeout(() => {
    copyButton.textContent = "Copy cURL ↗";
  }, 1600);
});

newKeyButton?.addEventListener("click", async () => {
  const label = window.prompt("API key label");
  if (!label?.trim()) return;
  newKeyButton.disabled = true;
  try {
    const response = await fetch(`${apiBase.replace(/\/$/, "")}/v1/account/keys`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: label.trim() }),
    });
    if (!response.ok) throw new Error("Unable to create key");
    const key = await response.json();
    if (key.raw_key) {
      window.alert(`Save this key now; it will not be shown again:\n${key.raw_key}`);
    }
    await loadAccountData();
  } catch (error) {
    window.alert(error.message);
  } finally {
    newKeyButton.disabled = false;
  }
});
