AOS.init({ duration: 1000, once: true });

let menuOpen = false;
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  menuOpen = !menuOpen;
  if (menuOpen) {
    navLinks.style.display = "flex";
    navLinks.style.flexDirection = "column";
    navLinks.style.position = "absolute";
    navLinks.style.background = "#FC9E4F";
    navLinks.style.width = "100%";
    navLinks.style.top = "100%";
    navLinks.style.left = 0;
    navLinks.style.padding = "1rem";
    navLinks.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    hamburger.classList.add("active");
  } else {
    navLinks.style.display = "none";
    hamburger.classList.remove("active");
  }
});

document.addEventListener("click", (e) => {
  if (
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target) &&
    menuOpen
  ) {
    navLinks.style.display = "none";
    hamburger.classList.remove("active");
    menuOpen = false;
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      if (menuOpen) {
        navLinks.style.display = "none";
        hamburger.classList.remove("active");
        menuOpen = false;
      }
    }
  });
});

async function loadProjects() {
  const username = "wineynia";
  const container = document.getElementById("projects-list");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`,
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const repos = await response.json();

    loading.style.display = "none";

    const projectNames = [
      "weather-and-country-information",
      "jungle-adventure",
      "fitness-gym-page",
      "25FEDassignment1",
      "borneo-jungle-adventure",
    ];
    const projects = repos
      .filter(
        (repo) =>
          projectNames.some((name) =>
            repo.name.toLowerCase().includes(name.toLowerCase()),
          ) ||
          repo.name.toLowerCase().includes("project") ||
          repo.name.toLowerCase().includes("portfolio"),
      )
      .slice(0, 8)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    if (projects.length === 0) {
      container.innerHTML =
        '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-color);"><p>No projects found. Visit my <a href="https://github.com/wineynia" target="_blank">GitHub</a>.</p></div>';
      return;
    }

    container.innerHTML = "";
    projects.forEach((repo, index) => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.style.animationDelay = `${index * 0.1}s`;
      card.innerHTML = `
                <div style="height:200px;background:linear-gradient(135deg,var(--main-color),var(--third-color));display:flex;align-items:center;justify-content:center;">
                    <span style="color:white;font-size:1.1rem;font-weight:500;text-align:center;padding:1rem;">${repo.name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                </div>
                <h3 style="padding:1rem;margin:0;">${repo.name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</h3>
                <p style="padding:0 1rem 1rem;color:#666;font-size:0.9rem;">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</p>
                <div class="project-links">
                    <a href="${repo.html_url}" class="gh" target="_blank" rel="noopener" aria-label="GitHub repo for ${repo.name}">
                        <i class="fab fa-github"></i> Code
                    </a>
                    <a href="${repo.homepage || `https://wineynia.github.io/${repo.name}`}" class="demo" target="_blank" rel="noopener" aria-label="Live demo for ${repo.name}">
                        <i class="fas fa-external-link-alt"></i> Live
                    </a>
                </div>
            `;
      container.appendChild(card);
    });
  } catch (err) {
    loading.style.display = "none";
    error.textContent =
      "Couldn't load projects (GitHub API limit?). View them on GitHub: github.com/wineynia";
    error.style.display = "block";
    console.error("GitHub API error:", err);
  }
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get("name") || "Anonymous";
  alert(
    `Thanks ${name}! Your message has been sent (demo mode). I'll get back to you soon!`,
  );
  e.target.reset();
});

loadProjects();
