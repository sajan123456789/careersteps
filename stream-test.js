document.getElementById("testForm").addEventListener("submit", e => {
  e.preventDefault();

  const score = { Science:0, Commerce:0, Arts:0, IT:0, Government:0 };

  ["q1","q2","q3"].forEach(q => {
    const ans = document.querySelector(`input[name="${q}"]:checked`);
    if(ans) score[ans.value] += 10;
  });

  const sorted = Object.entries(score).sort((a,b)=>b[1]-a[1]);
  const best = sorted[0][0];
  const second = sorted[1][0];

  const box = document.getElementById("result");
  box.classList.remove("hidden");
  box.innerHTML = `
    <h2 class="text-2xl font-bold mb-3">🤖 AI Career Recommendation</h2>

    <p><b>Best Choice:</b> <span class="text-cyan-400">${best}</span></p>
    <p class="mt-1"><b>Second Option:</b> ${second}</p>

    <p class="mt-4 text-gray-400">
      AI suggests you focus on <b>${best}</b> based on your interests and strengths.
    </p>

    <a href="explore.html?ai=${best}"
       class="block mt-6 text-center py-2 rounded-xl
              bg-gradient-to-r from-blue-500 to-cyan-400 font-semibold">
      View Recommended Careers →
    </a>
  `;
});