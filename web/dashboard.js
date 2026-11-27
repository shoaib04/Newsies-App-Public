const copyButton = document.querySelector("#copy-curl");
const newKeyButton = document.querySelector("#new-key-button");

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

newKeyButton?.addEventListener("click", () => {
  newKeyButton.textContent = "Preview only";
  window.setTimeout(() => {
    newKeyButton.textContent = "+ New key";
  }, 1600);
});
