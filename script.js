const months = [
  "Januari","Februari","Maart","April","Mei","Juni",
  "Juli","Augustus","September","Oktober","November","December"
];
let currentMonth = 0;

// Data per maand
let data = {};
months.forEach(m => data[m] = {categories:{}});

// Render maandknoppen
function renderMonths() {
  const div = document.getElementById("months");
  div.innerHTML = "";
  months.forEach((m,i)=>{
    const b=document.createElement("button");
    b.innerText = m;
    if(i===currentMonth) b.className="active";
    b.onclick=()=>{currentMonth=i; render();}
    div.appendChild(b);
  });
}

// Voeg entry toe
function addEntry() {
  const pathStr = document.getElementById("categoryPath").value.trim();
  const itemName = document.getElementById("itemName").value.trim();
  let amount = parseFloat(document.getElementById("amount").value);
  const kind = document.getElementById("kind").value;
  const freq = document.getElementById("frequency").value;
  if(!pathStr || !itemName || isNaN(amount)) return;

  // Pas frequentie aan naar maandbedrag
  switch(freq){
    case "week": amount = amount*4.33; break;
    case "year": amount = amount/12; break;
    case "once": break;
    case "month": break;
  }

  const path = pathStr.split(">").map(p=>p.trim());
  let obj = data[months[currentMonth]].categories;
  path.forEach(p=>{
    if(!obj[p]) obj[p]={items:[], sub:{}};
    obj=obj[p].sub;
  });

  let parent = data[months[currentMonth]].categories;
  path.forEach(p=>{parent=parent[p]});
  parent.items.push({name:itemName, amount, kind, freq});

  document.getElementById("categoryPath").value="";
  document.getElementById("itemName").value="";
  document.getElementById("amount").value="";
  render();
}

// Controleer of item in huidige maand telt
function appliesThisMonth(item) { return true; } // alle bedragen al omgerekend

// Bereken totaal inkomsten/uitgaven
function calculate() {
  let inc=0, exp=0;
  function walk(categ){
    Object.values(categ).forEach(cat=>{
      cat.items.forEach(item=>{
        if(item.kind==="income") inc+=item.amount;
        else exp+=item.amount;
      });
      walk(cat.sub);
    });
  }
  walk(data[months[currentMonth]].categories);
  return {inc, exp, bal: inc-exp};
}

// Render overzicht categorieën/items
function renderOverview() {
  const div = document.getElementById("overview");
  div.innerHTML="";
  function walk(categ, container){
    Object.keys(categ).forEach(key=>{
      const cat = categ[key];
      const catDiv = document.createElement("div");
      catDiv.className="category";
      const title = document.createElement("strong");
      title.innerText=key;
      catDiv.appendChild(title);

      // Subcategorie toevoegen
      const addSub = document.createElement("button");
      addSub.innerText="+Sub";
      addSub.className="small";
      addSub.onclick=()=>{
        const subName=prompt("Naam subcategorie:");
        if(!subName) return;
        cat.sub[subName]={items:[], sub:{}};
        render();
      };
      catDiv.appendChild(addSub);

      // Items tonen + bewerken/verwijderen
      cat.items.forEach((item,i)=>{
        const iDiv=document.createElement("div");
        iDiv.className="item";
        const nameInput = document.createElement("input");
        nameInput.value = item.name;
        nameInput.className="edit";
        nameInput.onchange=()=>{item.name=nameInput.value; render();}
        const amountInput = document.createElement("input");
        amountInput.value = item.amount.toFixed(2);
        amountInput.type="number";
        amountInput.className="edit";
        amountInput.onchange=()=>{item.amount=parseFloat(amountInput.value); render();}
        const delBtn = document.createElement("button");
        delBtn.innerText="❌";
        delBtn.className="small";
        delBtn.onclick=()=>{
          cat.items.splice(i,1);
          render();
        };
        iDiv.appendChild(nameInput);
        iDiv.appendChild(amountInput);
        iDiv.appendChild(delBtn);
        catDiv.appendChild(iDiv);
      });

      container.appendChild(catDiv);
      walk(cat.sub, catDiv);
    });
  }
  walk(data[months[currentMonth]].categories, div);
}

// Render grafiek
function renderChart(t){
  const c=document.getElementById("chart");
  const ctx=c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);
  const vals=[t.inc,t.exp];
  const cols=["#4caf50","#f44336"];
  const max=Math.max(...vals,1);
  vals.forEach((v,i)=>{
    const h=(v/max)*150;
    ctx.fillStyle=cols[i];
    ctx.fillRect(80+i*140,180-h,60,h);
  });
}

// Render alles
function render(){
  renderMonths();
  const t = calculate();
  document.getElementById("income").innerText=t.inc.toFixed(2);
  document.getElementById("expense").innerText=t.exp.toFixed(2);
  document.getElementById("balance").innerText=t.bal.toFixed(2);
  renderChart(t);
  renderOverview();
}

render();
