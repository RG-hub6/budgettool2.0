// --- Globale data ---
let budgetData = {};
let currentMonth = null;

// --- Functie: maand toevoegen ---
function addNewMonth() {
  const month = prompt("Naam van de nieuwe maand:");
  if (!month || budgetData[month]) return;

  budgetData[month] = { income: 0, categories: {}, balance: 0 };
  currentMonth = month;
  renderMonthButtons();
  renderMonth();
}

// --- Render knoppen voor maanden ---
function renderMonthButtons() {
  const container = document.getElementById("month-buttons");
  container.innerHTML = "";
  for (let month in budgetData) {
    const btn = document.createElement("button");
    btn.className = "month-button" + (month===currentMonth ? " active" : "");
    btn.innerText = month;
    btn.onclick = () => { currentMonth = month; renderMonth(); };
    container.appendChild(btn);
  }
}

// --- Render maand content ---
function renderMonth() {
  const container = document.getElementById("app");
  container.innerHTML = "";
  if (!currentMonth) return;

  const monthData = budgetData[currentMonth];

  const monthDiv = document.createElement("div");
  monthDiv.className = "month-block";

  monthDiv.innerHTML = `
    <h2>${currentMonth}</h2>
    <label>Inkomen (€):</label>
    <input type="number" id="income" value="${monthData.income}">
    <button onclick="updateIncome()">Opslaan</button>
    <p>Saldo: €<span id="balance">${monthData.balance.toFixed(2)}</span></p>
    <button onclick="addCategory(null)">+ Nieuwe categorie</button>
    <div id="categories"></div>
  `;

  container.appendChild(monthDiv);
  renderCategories();
}

// --- Inkomsten opslaan ---
function updateIncome() {
  const val = parseFloat(document.getElementById("income").value);
  if (!isNaN(val)) {
    budgetData[currentMonth].income = val;
    updateBalance();
  }
}

// --- Balans berekenen ---
function updateBalance() {
  const monthData = budgetData[currentMonth];
  let totalExpenses = calculateExpenses(monthData.categories);
  let balance = monthData.income - totalExpenses;
  monthData.balance = balance;
  document.getElementById("balance").innerText = balance.toFixed(2);
}

// --- Recursief uitgaven berekenen ---
function calculateExpenses(categories) {
  let sum = 0;
  for (let key in categories) {
    const item = categories[key];
    if (item.amount) sum += item.amount;
    if (item.sub) sum += calculateExpenses(item.sub);
  }
  return sum;
}

// --- Categorie/subcategorie toevoegen ---
function addCategory(parent) {
  const name = prompt("Naam van categorie/subcategorie:");
  if (!name) return;

  const container = parent ? parent.querySelector(".sub") : document.getElementById("categories");
  const newDiv = document.createElement("div");
  newDiv.className = parent ? "sub-category" : "category";
  newDiv.innerHTML = `<strong>${name}</strong> <button onclick="addCategory(this.parentNode)">+ Subcategorie</button> <input type="number" placeholder="Uitgave (€)" oninput="updateAmount(this, '${name}')"><div class="sub"></div>`;
  
  container.appendChild(newDiv);
  if (!parent) budgetData[currentMonth].categories[name] = { sub:{} };
  else {
    let parentName = parent.querySelector("strong").innerText;
    if (!parent.dataset.sub) parent.dataset.sub = "{}";
    let subObj = JSON.parse(parent.dataset.sub);
    subObj[name] = { sub:{} };
    parent.dataset.sub = JSON.stringify(subObj);
  }
}

// --- Uitgaven updaten ---
function updateAmount(input, name) {
  const val = parseFloat(input.value);
  if (isNaN(val)) return;

  // Dit is een eenvoudige manier: alles boven categorie/subcategorie opslaan
  let monthData = budgetData[currentMonth];
  monthData.categories[name].amount = val;
  updateBalance();
}

// --- Start met 12 maanden standaard ---
["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"].forEach(m => {
  budgetData[m] = { income: 0, categories: {}, balance:0 };
});
currentMonth = "Januari";
renderMonthButtons();
renderMonth();

