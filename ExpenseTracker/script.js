const budgetForm = document.getElementById('budget-form');
const budgetInput = document.getElementById('budget-input');
const expenseForm = document.getElementById('expense-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const list = document.getElementById('expense-list');
const total = document.getElementById('total');
const remaining = document.getElementById('remaining');
///Script
let totalAmount = 0;
let budget = 0;

budgetForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const input = parseFloat(budgetInput.value);
  if (!isNaN(input) && input > 0) {
    budget = input;
    updateRemaining();
    budgetInput.value = '';
  }
});

expenseForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const description = desc.value.trim();
  const value = parseFloat(amount.value);

  if (description && !isNaN(value) && value > 0) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${description}</span>
      <span>$${value.toFixed(2)}</span>
    `;
    list.appendChild(li);

    totalAmount += value;
    total.textContent = totalAmount.toFixed(2);

    updateRemaining();

    desc.value = '';
    amount.value = '';
  }
});

function updateRemaining() {
  const remain = budget - totalAmount;
  remaining.textContent = remain.toFixed(2);

  if (remain < 0) {
    remaining.style.color = '#dc2626'; // red
  } else {
    remaining.style.color = '#1e40af'; // blue
  }
}
