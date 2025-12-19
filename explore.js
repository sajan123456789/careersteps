const grid = document.getElementById("grid");
const search = document.getElementById("search");

const params = new URLSearchParams(location.search);
const aiCat = params.get("ai");

let list = Object.keys(CAREERS).map(k => ({ ...CAREERS[k], key:k }));

if(aiCat){
  list = list.filter(c => c.category === aiCat);
}

function render(arr){
  grid.innerHTML = "";
  arr.forEach(c=>{
    grid.innerHTML += `
      <div class="p-6 rounded-xl bg-slate-900">
        <h3 class="font-bold">${c.title}</h3>
        <p class="text-sm text-gray-400 mt-2">${c.description}</p>
        <a href="career.html?career=${c.key}"
           class="block mt-4 text-cyan-400 font-semibold">
           View Roadmap →
        </a>
      </div>
    `;
  });
}

search.addEventListener("input",()=>{
  const q = search.value.toLowerCase();
  render(list.filter(c=>c.title.toLowerCase().includes(q)));
});

render(list);