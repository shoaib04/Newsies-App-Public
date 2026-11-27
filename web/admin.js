const exportButton = document.querySelector("#admin-export");

exportButton?.addEventListener("click", () => {
  exportButton.textContent = "Preview only";
  window.setTimeout(() => {
    exportButton.innerHTML = 'Export report <span aria-hidden="true">↗</span>';
  }, 1600);
});
