// --- Globale data ---
let budgetData = {};

// --- Helper functies ---
function createMonthBlock(month) {
  if (!budgetData[month]) {
    budgetData[month] = { income: 0, expenses: {}, balance: 0 };
  }

  const app = document.getElementById("app");

  const monthDiv = document.createElement("div");
  monthDiv.className = "month-block";
  monthDiv.id = `month-${month}`;

  monthDiv.innerHTML = `
    <h2>${month}</h2>
    <label>Inkomen (€):</label>
    <input type="number" id="income-${month}" placeholder="bv. 1000">
    <button onclick="addIncome('${month}')">Toevoegen</button>
    <p>Huidig inkomen: €<span id="currentIncome-${month}">0</span></p>

    <h3>Uitgaven toevoegen</h3>
    <label>Bedrag (€):</label>
    <input type="number" id="expense-${month}" placeholder="bv. 200">
    <label>Categorie:</label>
    <input type="text" id="category-${month}" placeholder="bv. Voeding">
    <label>Subcategorie:</label>
    <input type="text" id="sub-${month}" placeholder="bv. Snacks">
    <button onclick="addExpense('${month}')">Toevoegen</button>

    <p>Totaal uitgaven: €<span id="currentExpenses-${month}">0</span></p>
    <p>Saldo: €<span id="balance-${month}">0</span></p>

    <button onclick="addCategory('${month}')">Nieuwe categorie toevoegen</button>
    <div id="categories-${month}"></div>
  `;

  app.appendChild(monthDiv);
}

function addIncome(month) {
  const val = parseFloat(document.getElementById(`income-${month}`).value);
  if (!isNaN(val)) {
    budgetData[month].income += val;
    document.getElementById(`currentIncome-${month}`).innerText = budgetData[month].income.toFixed(2);
    updateBalance(month);
    document.getElementById(`income-${month}`).value = "";
  }
}

function addExpense(month) {
  const expense = parseFloat(document.getElementById(`expense-${month}`).value);
  const category = document.getElementById(`category-${month}`).value || "Overige";
  const sub = document.getElementById(`sub-${month}`).value || "";

  if (!budgetData[month].expenses[category]) {
    budgetData[month].expenses[category] = {};
  }
  if (!budgetData[month].expenses[category][sub]) {
    budgetData[month].expenses[category][sub] = 0;
  }
  budgetData[month].expenses[category][sub] += isNaN(expense) ? 0 : expense;

  // Update totaal uitgaven
  let total = 0;
  for (let cat in budgetData[month].expenses) {
    for (let subCat in budgetData[month].expenses[cat]) {
      total += budgetData[month].expenses[cat][subCat];
    }
  }
  document.getElementById(`currentExpenses-${month}`).innerText = total.toFixed(2);
  updateBalance(month);

  document.getElementById(`expense-${month}`).value = "";
  document.getElementById(`category-${month}`).value = "";
  document.getElementById(`sub-${month}`).value = "";
}

function updateBalance(month) {
  let totalExpenses = parseFloat(document.getElementById(`currentExpenses-${month}`).innerText);
  let income = budgetData[month].income;
  let balance = income - totalExpenses;
  budgetData[month].balance = balance;
  document.getElementById(`balance-${month}`).innerText = balance.toFixed(2);
}

function addCategory(month) {
  const catName = prompt("Naam van nieuwe categorie:");
  if (!catName) return;

  const catDiv = document.createElement("div");
  catDiv.className = "category";
  catDiv.innerHTML = `<strong>${catName}</strong> <button onclick="addSubCategory('${month}', this.parentNode)">&plus; Subcategorie</button>`;
  document.getElementById(`categories-${month}`).appendChild(catDiv);
}

function addSubCategory(month, parentDiv) {
  const subName = prompt("Naam van subcategorie:");
  if (!subName) return;

  const subDiv = document.createElement("div");
  subDiv.className = "sub-category";
  subDiv.innerHTML = `<span>${subName}</span>`;
  parentDiv.appendChild(subDiv);
}

// --- Start: voeg eerste maand toe ---
createMonthBlock("Januari");
createMonthBlock("Februari");
