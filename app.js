const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

// Load from localStorage or start empty
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Chart.js setup
const ctx = document.getElementById("expenseChart").getContext("2d");
let expenseChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expense", "Balance"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#22c55e", "#ef4444", "#3b82f6"], // green, red, blue
        borderWidth: 1,
      },
    ],
  },
});

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update summary + chart
function updateSummary() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${expense}`;
  balanceEl.textContent = `₹${balance}`;

  // update chart
  expenseChart.data.datasets[0].data = [income, expense, balance];
  expenseChart.update();
}

// Render transaction list
function renderTransactions() {
//   transactionList.innerHTML = "";
//   transactions.forEach((t, index) => {
//     const li = document.createElement("li");
//     li.innerHTML = `
//       ${t.title} - <span style="color:${t.type === "income" ? "green" : "red"}">₹${t.amount}</span>
//       <button onclick="deleteTransaction(${index})">✖</button>
//     `;
//     transactionList.appendChild(li);
//   });
transactionList.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "6px";
    li.style.padding = "6px 10px";
    li.style.border = "1px solid #ddd";
    li.style.borderRadius = "6px";
    li.style.background = "#fafafa";

    li.innerHTML = `
      <span style="flex:1">${t.title}</span>
      <span style="color:${t.type === "income" ? "green" : "red"}; margin-right:12px;">₹${t.amount}</span>
      <button onclick="deleteTransaction(${index})" style="border:none;background:red;color:white;padding:3px 8px;border-radius:4px;cursor:pointer;">✖</button>
    `;
    transactionList.appendChild(li);
  });

}

// Delete transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveToLocalStorage();
  renderTransactions();
  updateSummary();
}

// Form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = +amountInput.value.trim();
  const type = typeInput.value;

  if (!title || !amount) return;

  transactions.push({ title, amount, type });

  saveToLocalStorage();
  renderTransactions();
  updateSummary();

  titleInput.value = "";
  amountInput.value = "";
});

// Initialize on load
renderTransactions();
updateSummary();
