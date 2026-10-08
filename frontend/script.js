const API_URL = "https://internship-api-dyk6.onrender.com";

const list = document.getElementById("internshipList");
const search = document.getElementById("search");
const domain = document.getElementById("domain");
const resultsStatus = document.getElementById("resultsStatus");

let internships = [];

// Escape HTML for safe display
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Show loading message
function showLoading() {
  list.innerHTML = `
    <div class="loading">
      Loading internships...
    </div>
  `;

  resultsStatus.textContent = "Loading available internships...";
}

// Show error message
function showError() {
  list.innerHTML = `
    <div class="error">
      Unable to load internships. Please try again later.
    </div>
  `;

  resultsStatus.textContent = "Unable to load internships.";
}

// Display internships
function displayInternships() {
  const searchText = search.value.trim().toLowerCase();
  const selectedDomain = domain.value;

  const filtered = internships.filter((item) => {
    const title = String(item.title || "").toLowerCase();
    const company = String(item.company || "").toLowerCase();

    const matchesSearch =
      title.includes(searchText) ||
      company.includes(searchText);

    const matchesDomain =
      selectedDomain === "" ||
      item.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <h3>No internships found</h3>
        <p>Try another search or domain.</p>
      </div>
    `;

    resultsStatus.textContent = "No internships found.";
    return;
  }

  resultsStatus.textContent =
    `${filtered.length} internship${filtered.length === 1 ? "" : "s"} found`;

  filtered.forEach((item) => {
    const card = document.createElement("article");

    card.className = "card";

    card.innerHTML = `
      <h2>${escapeHtml(item.title)}</h2>
      <p><strong>Company:</strong> ${escapeHtml(item.company)}</p>
      <p><strong>Domain:</strong> ${escapeHtml(item.domain)}</p>
    `;

    list.appendChild(card);
  });
}

// Load internships from API
async function loadInternships() {
  showLoading();

  try {
    const response = await fetch(`${API_URL}/internships`);

    if (!response.ok) {
      throw new Error("Failed to fetch internships");
    }

    const result = await response.json();

    internships = Array.isArray(result.data)
      ? result.data
      : [];

    displayInternships();
  } catch (error) {
    console.error("API Error:", error);
    showError();
  }
}

// Search
search.addEventListener("input", displayInternships);

// Domain filter
domain.addEventListener("change", displayInternships);

// Load data when page opens
loadInternships();
