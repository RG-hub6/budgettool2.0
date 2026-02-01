let budgetData = {};
let currentMonth = "Januari";

const months = [
  "Januari","Februari","Maart","April","Mei","Juni",
  "Juli","Augustus","September","Oktober","November","December"
];

months.forEach(m => {
  budgetData[m] = {
    categories: {},
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  };
});

function renderMonthButtons() {
  const div = document.getElementById("month-buttons");
  div.innerHTML = "";
  months.forEach(m => {
    const b = document.createElement("button");
    b.innerText = m;
    if (m === currentMonth) b.classList.add("active");
    b.onclick = () => {
      currentMonth = m;
      renderAll();
    };
    div.appendChild(b);
  });
}

function renderAll() {
  renderMonthButtons();
  calculateMonth();
  renderSummary();
  renderChart();
}

function calculateMonth() {
  let income = 0;
  let expense = 0;

  function walk(obj) {
    for (let k in obj) {
      const item = obj[k];
      if (item.amount) {
        if (item.type === "income") income += item.amount;
        else expense += item.amount;
      }
      walk(item.sub || {});
    }
  }

  walk(budgetData[currentMonth].categories);

  budgetData[currentMonth].totalIncome = income;
  budgetData[currentMonth].totalExpense = expense;
  budgetData[currentMonth].balance = income - expense;
}

function renderSummary() {
  const m = budgetData[currentMonth];
  document.getElementById("total-income").innerText = m.totalIncome.toFixed(2);
  document.getElementById("total-expense").innerText = m.totalExpense.toFixed(2);
  document.getElementById("balance").innerText = m.balance.toFixed(2);
}

function renderChart() {
  const c = document.getElementById("chart");
  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);

  const m = budgetData[currentMonth];
  const values = [m.totalIncome, m.totalExpense, m.balance];
  const labels = ["Inkomsten","Uitgaven","Saldo"];
  const max = Math.max(...values, 1);

  values.forEach((v,i) => {
    const h = (v / max) * 150;
    ctx.fillStyle = i === 0 ? "#4caf50" : i === 1 ? "#f44336" : "#2196f3";
    ctx.fillRect(60 + i*100, 180 - h, 40, h);
    ctx.fillStyle = "#000";
    ctx.fillText(labels[i], 50 + i*100, 195);
    ctx.fillText("€"+v.toFixed(0), 55 + i*100, 170 - h);
  });
}

renderAll();

