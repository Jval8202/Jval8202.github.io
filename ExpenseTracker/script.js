const form = document.getElementById('expense-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const list = document.getElementById('expense-list');
const total = document.getElementById('total');

let totalAmount = 0;

form.addEventListener('submit', function(e) {
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

    desc.value = '';
    amount.value = '';
  }
});
