document.addEventListener("DOMContentLoaded", () => {

  /* ================= BASIC SETUP ================= */
  const grid = document.getElementById("careerGrid");
  const searchInput = document.getElementById("careerSearch");

  if (!grid) {
    console.error("careerGrid not found in HTML");
    return;
  }
  if (typeof CAREERS === "undefined") {
    console.error("CAREERS data not loaded");
    grid.innerHTML = `
      <div class="col-span-full text-center text-gray-400">
        Career data is loading or missing.
      </div>`;
    return;
  }

  let activeCategory = "All";
  const HOME_LIMIT = 6;

  /* ================= DATA PREP ================= */
  const ALL = Object.keys(CAREERS).map(key => ({
    ...CAREERS[key],
    key
  }));

  /* ================= AI SCORE (SMART SORTING) ================= */
  function aiScore(c, query = "") {
    let score = 0;

    // Search intent
    if (query && c.title.toLowerCase().includes(query)) score += 40;

    // High-demand categories
    if (["IT", "Medical", "Government", "Engineering"].includes(c.category))
      score += 20;

    // Salary signal
    if (c.salary) {
      const n = parseInt(c.salary);
      if (n >= 10) score += 20;
      else if (n >= 5) score += 10;
    }

    // Roadmap richness
    if (Array.isArray(c.roadmap)) score += c.roadmap.length * 2;

    return score;
  }

  /* ================= CATEGORY FILTER ================= */
  const filters = {
    After10: c => c.level && c.level.includes("10"),
    After12: c => c.level && c.level.includes("12"),
    Science: c => ["IT", "Engineering", "Medical"].includes(c.category),
    Commerce: c => c.category === "Commerce",
    Arts: c => c.category === "Arts",
    Government: c => c.category === "Government"
  };

  /* ================= RENDER ================= */
  function render(list) {
    grid.innerHTML = "";

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center text-gray-400">
          No careers found.
        </div>`;
      return;
    }

    list.slice(0, HOME_LIMIT).forEach(c => {
      grid.innerHTML += `
        <div class="glass p-6 rounded-2xl hover:scale-[1.02] transition">
          <div class="flex justify-between items-center text-xs">
            <span class="text-cyan-400 font-semibold">${c.category}</span>
            <span class="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">
              AI Match ${Math.min(95, 60 + aiScore(c) / 2)}%
            </span>
          </div>

          <h3 class="text-xl font-bold mt-3">${c.title}</h3>

          <p class="text-sm text-gray-400 mt-3 leading-relaxed">
            <b>Eligibility:</b> ${c.eligibility?.[0] || "—"}<br>
            <b>Exams:</b> ${c.exams || "—"}<br>
            <b>Salary:</b> ${c.salary || "Varies"}
          </p>

          <a href="career.html?career=${c.key}"
             class="block mt-6 text-center py-2 rounded-xl
                    bg-gradient-to-r from-blue-500 to-cyan-400
                    font-semibold hover:opacity-90">
            View Career Roadmap →
          </a>
        </div>
      `;
    });
  }

  /* ================= APPLY AI LOGIC ================= */
  function applyAI() {
    const q = searchInput ? searchInput.value.toLowerCase() : "";

    let list = ALL.map(c => ({
      ...c,
      _ai: aiScore(c, q)
    }));

    // Category filter
    if (filters[activeCategory]) {
      list = list.filter(filters[activeCategory]);
    }

    // AI sorting
    list.sort((a, b) => b._ai - a._ai);

    render(list);
  }

  /* ================= CATEGORY CLICK ================= */
  window.setCategory = function (cat) {
    activeCategory = cat;

    document.querySelectorAll("[onclick^='setCategory']")
      .forEach(btn => btn.classList.remove("active"));

    applyAI();
  };

  /* ================= SEARCH ================= */
  if (searchInput) {
    searchInput.addEventListener("input", applyAI);
  }

  /* ================= INITIAL LOAD ================= */
  applyAI();

});