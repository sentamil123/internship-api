const internships = [
  {
    title: "Python Developer Intern",
    company: "Tech Solutions",
    domain: "Python"
  },
  {
    title: "Frontend Developer Intern",
    company: "XYZ Labs",
    domain: "Web Development"
  },
  {
    title: "Data Science Intern",
    company: "ABC Tech",
    domain: "Data Science"
  }
];

const list = document.getElementById("internshipList");
const search = document.getElementById("search");
const domain = document.getElementById("domain");

function displayInternships() {
  const searchText = search.value.toLowerCase();
  const selectedDomain = domain.value;

  const filtered = internships.filter(item =>
    (item.title.toLowerCase().includes(searchText) ||
     item.company.toLowerCase().includes(searchText)) &&
    (selectedDomain === "" || item.domain === selectedDomain)
  );

  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = "<p>No internships found.</p>";
    return;
  }

  filtered.forEach(item => {
    list.innerHTML += `
      <div class="card">
        <h2>${item.title}</h2>
        <p>Company: ${item.company}</p>
        <p>Domain: ${item.domain}</p>
      </div>
    `;
  });
}

search.addEventListener("input", displayInternships);
domain.addEventListener("change", displayInternships);

displayInternships();
