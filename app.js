const STORAGE_KEY = "group-trip-settle-up-v1";
const BASE = "INR";
const fallbackRates = { INR:1, USD:83.5, EUR:91.2, GBP:106.4, AED:22.75, JPY:0.56 };
let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {
  members: [], expenses: [], rates: fallbackRates, ratesUpdated: "Built-in fallback"
};

const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n);
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); const destinations=[
{id:"goa",name:"Goa",region:"India • Beach Trip",image:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",description:"Beaches, forts, cafés and sunset spots.",places:[["Baga Beach","Beach & nightlife"],["Calangute Beach","Beach"],["Fort Aguada","Historic fort"],["Dudhsagar Falls","Waterfall"]],route:["Panaji","Fort Aguada","Calangute","Baga","Dudhsagar"]},
{id:"kashmir",name:"Jammu & Kashmir",region:"India • Mountain Trip",image:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80",description:"Lakes, valleys, gardens and mountain views.",places:[["Srinagar","Dal Lake & city"],["Gulmarg","Mountain & gondola"],["Pahalgam","Valley & rivers"],["Sonamarg","Mountain valley"]],route:["Jammu","Srinagar","Gulmarg","Pahalgam","Sonamarg"]},
{id:"manali",name:"Kullu Manali",region:"Himachal Pradesh • Mountain Trip",image:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",description:"Himalayan valleys, waterfalls, cafés and adventure.",places:[["Mall Road Manali","Shopping & cafés"],["Solang Valley","Adventure & snow"],["Hidimba Temple","Temple & forest"],["Kasol","Parvati Valley"]],route:["Kullu","Kasol","Manali","Hidimba Temple","Solang Valley"]},
{id:"dehradun",name:"Dehradun",region:"Uttarakhand • Weekend Trip",image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",description:"Waterfalls, caves and nearby mountain towns.",places:[["Robber's Cave","Cave & stream"],["Sahastradhara","Waterfall"],["Forest Research Institute","Heritage campus"],["Mussoorie","Nearby hill station"]],route:["Dehradun","Robber's Cave","Sahastradhara","Mussoorie"]},
{id:"delhi",name:"Delhi",region:"India • City Trip",image:"https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",description:"Historic monuments, food streets and markets.",places:[["India Gate","Monument"],["Red Fort","Historic fort"],["Qutub Minar","Historic monument"],["Akshardham","Temple complex"]],route:["India Gate","Red Fort","Chandni Chowk","Qutub Minar","Akshardham"]}
];
function renderTripCards(q=""){q=q.toLowerCase().trim();const list=destinations.filter(d=>!q||d.name.toLowerCase().includes(q)||d.region.toLowerCase().includes(q)||d.places.some(p=>p[0].toLowerCase().includes(q)));$("tripCards").innerHTML=list.length?list.map(d=>`<button class="trip-card" data-trip="${d.id}" type="button"><img src="${d.image}" alt="${escapeHtml(d.name)}"><span>${escapeHtml(d.region)}</span><strong>${escapeHtml(d.name)}</strong><small>${d.places.length} places • roadmap ready</small></button>`).join(""):`<div class="empty">No destination found. Try Goa, Kashmir, Manali, Dehradun or Delhi.</div>`;document.querySelectorAll(".trip-card").forEach(b=>b.onclick=()=>selectTrip(b.dataset.trip));}
function selectTrip(id){const d=destinations.find(x=>x.id===id);if(!d)return;state.trip=id;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));$("tripDetails").classList.remove("hidden");$("tripImage").src=d.image;$("tripRegion").textContent=d.region;$("tripTitle").textContent=d.name;$("tripDescription").textContent=d.description;$("placeCount").textContent=`${d.places.length} popular places`;$("placesGrid").innerHTML=d.places.map(p=>`<a class="place-card" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p[0]+" "+d.name)}" target="_blank" rel="noopener"><img src="https://source.unsplash.com/700x450/?${encodeURIComponent(p[0]+","+d.name)}" alt="${escapeHtml(p[0])}" loading="lazy"><div><strong>${escapeHtml(p[0])}</strong><small>${escapeHtml(p[1])}</small></div></a>`).join("");$("roadmap").innerHTML=d.route.map((r,i)=>`<div class="route-stop"><b>${i+1}</b><span>${escapeHtml(r)}</span></div>`).join("");$("mapsLink").href="https://www.google.com/maps/dir/?api=1&origin="+encodeURIComponent(d.route[0]+" India")+"&destination="+encodeURIComponent(d.route.at(-1)+" India")+"&waypoints="+encodeURIComponent(d.route.slice(1,-1).map(x=>x+" India").join("|"));document.querySelectorAll(".trip-card").forEach(b=>b.classList.toggle("selected",b.dataset.trip===id));}
$("tripSearch").addEventListener("input",e=>renderTripCards(e.target.value));$("clearTripBtn").onclick=()=>{$("tripSearch").value="";renderTripCards();$("tripDetails").classList.add("hidden")};renderTripCards();if(state.trip)selectTrip(state.trip);

render(); }
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

function render(){
  $("memberCount").textContent=state.members.length;
  const total=state.expenses.reduce((a,e)=>a+e.amount*rate(e.currency),0);
  $("totalDisplay").textContent=money(total);
  $("expenseCount").textContent=`${state.expenses.length} item${state.expenses.length===1?"":"s"}`;
  $("membersList").innerHTML=state.members.map((m,i)=>`<span class="chip">${escapeHtml(m)} <button title="Remove" onclick="removeMember(${i})">×</button></span>`).join("");
  $("expensePayer").innerHTML=state.members.map(m=>`<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("");
  $("splitMembers").innerHTML=state.members.map((m,i)=>`<label class="check"><input type="checkbox" value="${escapeHtml(m)}" ${i<state.members.length?"checked":""}>${escapeHtml(m)}</label>`).join("");
  $("expenseTable").innerHTML=state.expenses.map((e,i)=>`<tr><td><strong>${escapeHtml(e.description)}</strong><br><small>${e.currency} ${e.amount.toFixed(2)}</small></td><td>${escapeHtml(e.payer)}</td><td class="amount">${money(e.amount*rate(e.currency))}</td><td>${e.split.length} people</td><td><button class="delete-btn" onclick="removeExpense(${i})">Delete</button></td></tr>`).join("");
  $("expensesEmpty").classList.toggle("hidden",state.expenses.length>0);
  $("expenseTableWrap").classList.toggle("hidden",state.expenses.length===0);
  renderBalances(); renderRates();
}
function rate(currency){return Number(state.rates[currency] || fallbackRates[currency] || 1)}
function removeMember(i){
  const name=state.members[i];
  if(state.expenses.some(e=>e.payer===name || e.split.includes(name))){alert("This member is used in an expense. Delete those expenses first.");return;}
  state.members.splice(i,1); save();
}
function removeExpense(i){state.expenses.splice(i,1);save();}

$("memberForm").addEventListener("submit",e=>{
  e.preventDefault(); const name=$("memberName").value.trim();
  if(!name)return;
  if(state.members.some(m=>m.toLowerCase()===name.toLowerCase())){alert("Member already exists.");return;}
  state.members.push(name); $("memberName").value=""; save();
});
$("expenseForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!state.members.length){alert("Add at least one member first.");return;}
  const desc=$("expenseDesc").value.trim(), amount=Number($("expenseAmount").value), payer=$("expensePayer").value;
  const split=[...document.querySelectorAll("#splitMembers input:checked")].map(x=>x.value);
  if(!desc || !amount || amount<=0 || !payer || !split.length){alert("Please complete all fields and select at least one person.");return;}
  state.expenses.push({id:Date.now(),description:desc,amount,currency:$("expenseCurrency").value,payer,split});
  e.target.reset(); save();
});
$("clearAllBtn").addEventListener("click",()=>{
  if(confirm("Clear all members, expenses and saved data?")){localStorage.removeItem(STORAGE_KEY);state={members:[],expenses:[],rates:fallbackRates,ratesUpdated:"Built-in fallback"};render();}
});
$("refreshRates").addEventListener("click",refreshRates);

function calculateBalances(){
  const b=Object.fromEntries(state.members.map(m=>[m,0]));
  for(const e of state.expenses){
    const total=e.amount*rate(e.currency), share=total/e.split.length;
    if(b[e.payer]!==undefined)b[e.payer]+=total;
    e.split.forEach(m=>{if(b[m]!==undefined)b[m]-=share});
  }
  return b;
}
function minimumTransfers(balances){
  let debtors=[], creditors=[];
  for(const [name,val] of Object.entries(balances)){
    if(val < -0.005) debtors.push({name,amount:-val});
    if(val > 0.005) creditors.push({name,amount:val});
  }
  debtors.sort((a,b)=>b.amount-a.amount); creditors.sort((a,b)=>b.amount-a.amount);
  const out=[]; let i=0,j=0;
  while(i<debtors.length && j<creditors.length){
    const amount=Math.min(debtors[i].amount,creditors[j].amount);
    out.push({from:debtors[i].name,to:creditors[j].name,amount});
    debtors[i].amount-=amount; creditors[j].amount-=amount;
    if(debtors[i].amount<0.005)i++;
    if(creditors[j].amount<0.005)j++;
  }
  return out;
}
function renderBalances(){
  const b=calculateBalances(), settlements=minimumTransfers(b);
  $("balances").innerHTML=state.members.length ? Object.entries(b).map(([n,v])=>`<div class="balance"><div><strong>${escapeHtml(n)}</strong><small>${v>=0?"gets back":"owes"}</small></div><strong class="${v>=0?"positive":"negative"}">${v>=0?"+":""}${money(v)}</strong></div>`).join("") : `<div class="empty">Add members to see balances.</div>`;
  $("settlements").innerHTML=settlements.length ? settlements.map(s=>`<div class="settlement"><span><strong>${escapeHtml(s.from)}</strong> pays <strong>${escapeHtml(s.to)}</strong></span><strong>${money(s.amount)}</strong></div>`).join("") : `<div class="empty">Everything is settled. 🎉</div>`;
  $("paymentCount").textContent=settlements.length;
}
function renderRates(){
  $("rateStatus").textContent=`1 unit of foreign currency → INR. ${state.ratesUpdated || ""}`;
  $("rates").innerHTML=Object.entries(state.rates).map(([c,r])=>`<div class="rate"><strong>${c}</strong><span>${Number(r).toFixed(4)} INR</span><small>1 ${c}</small></div>`).join("");
}
async function refreshRates(){
  $("rateStatus").textContent="Fetching latest rates…";
  try{
    const res=await fetch("https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP,AED,JPY",{cache:"no-store"});
    if(!res.ok) throw new Error("API error");
    const data=await res.json();
    // API returns foreign currency per 1 INR, so invert to get INR per foreign unit.
    const rates={INR:1};
    for(const [c,v] of Object.entries(data.rates||{})) rates[c]=1/Number(v);
    state.rates={...fallbackRates,...rates}; state.ratesUpdated=`Updated ${new Date().toLocaleString()}`;
    save(); $("rateStatus").textContent=state.ratesUpdated;
  }catch(err){
    state.rates={...fallbackRates}; state.ratesUpdated="API unavailable — using built-in fallback rates";
    save(); $("rateStatus").textContent=state.ratesUpdated;
  }
}
render();
