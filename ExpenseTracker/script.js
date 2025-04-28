const budgetForm = document.getElementById('budget-form');
const budgetInput = document.getElementById('budget-input');
const expenseForm = document.getElementById('expense-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const list = document.getElementById('expense-list');
const total = document.getElementById('total');
const remaining = document.getElementById('remaining');
const monthCategorySelect = document.getElementById('month-category');
const monthNameSelect = document.getElementById('month-name');
const monthAmountInput = document.getElementById('month-amount');

let totalAmount = 0;
let budget = 0;

budgetForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const input = parseFloat(budgetInput.value);
  if (!isNaN(input) && input > 0) {
    budget = input;
    updateRemaining();
    updateChart(); 
    budgetInput.value = '';
  }
});

expenseForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const description = desc.value.trim();
  const value = parseFloat(amount.value);
  const categoryValue = category.value;

  if (description && !isNaN(value) && value > 0) {
    // Add to list
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>(${categoryValue})</strong> ${description}</span>
      <span>$${value.toFixed(2)}</span>
    `;
    list.appendChild(li);
  
    // Update totals
    totalAmount += value;
    total.textContent = totalAmount.toFixed(2);
  
    // Update category totals
    if (!categories[categoryValue]) {
      categories[categoryValue] = 0;
    }
    categories[categoryValue] += value;
  
    updateRemaining();
    updateChart();
    updateCategoryChart();
  
    // Reset fields
    desc.value = '';
    amount.value = '';
    category.value = 'Category';
  }
});

function updateRemaining() {
  const remain = budget - totalAmount;
  remaining.textContent = remain.toFixed(2);

  // Remove over-budget styles
  remaining.style.color = '';
  total.style.color = '';

  const alertBox = document.getElementById('budget-alert');
  
  if (remain < 0) {
    remaining.style.color = '#dc2626'; // red
    total.style.color = '#dc2626';
    alertBox.classList.remove('hidden');
    setTimeout(() => alertBox.classList.add('hidden'), 4000);
  } else {
    alertBox.classList.add('hidden');
  }
}

// Chart.js setup
const ctx = document.getElementById('budgetChart').getContext('2d');
const budgetChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Budget', 'Spent'],
    datasets: [{
      label: 'Amount ($)',
      data: [budget, totalAmount],
      backgroundColor: ['#60a5fa', '#f87171'],
      borderRadius: 8,
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 50 }
      }
    }
  }
});

function updateChart() {
  budgetChart.data.datasets[0].data = [budget, totalAmount];
  budgetChart.update();
}

// Category tracking
const categories = {};
const categoryColors = {};

let lastHue = 0;
function generateColor() {
  lastHue = (lastHue + 47) % 360;
  const saturation = 70;
  const lightness = 55;
  return `hsl(${lastHue}, ${saturation}%, ${lightness}%)`;
}

// Pie chart setup
const catCtx = document.getElementById('categoryChart').getContext('2d');
const categoryChart = new Chart(catCtx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 1
    }]
  },
  options: {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

function updateCategoryChart() {
  categoryChart.data.labels = Object.keys(categories);
  categoryChart.data.datasets[0].data = Object.values(categories);
  categoryChart.data.datasets[0].backgroundColor = Object.keys(categories).map(cat => {
    if (!categoryColors[cat]) {
      categoryColors[cat] = generateColor();
    }
    return categoryColors[cat];
  });
  categoryChart.update();
}

const categoryColorsMonthly = {
  "Dining": "#4ade80",         // Green
  "Entertainment": "#60a5fa",       // Blue
  "Groceries": "#facc15", // Yellow
  "Shopping": "#f472b6",       // Pink
  "Utilities": "#FFA500"       // Orange
};


const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'];

const monthlyData = {}; 

function populateMonthInputs() {
monthlyInputs.innerHTML = '';
monthNames.forEach(month => {
const input = document.createElement('input');
input.type = 'number';
input.placeholder = month;
input.name = month;
input.classList.add('month-input');
monthlyInputs.appendChild(input);
});
}

monthCategorySelect.addEventListener('change', populateMonthInputs);

const monthlyForm = document.getElementById('monthly-category-form');
monthlyForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const selectedCategory = monthCategorySelect.value;
  const selectedMonth = monthNameSelect.value;
  const amount = parseFloat(monthAmountInput.value);
  
  if (!selectedCategory || !selectedMonth || isNaN(amount)) return;
  
  if (!monthlyData[selectedCategory]) {
    monthlyData[selectedCategory] = Array(12).fill(0); 
  }
  
  const monthIndex = monthNames.indexOf(selectedMonth);
  if (monthIndex !== -1) {
    monthlyData[selectedCategory][monthIndex] += amount;
  }
  
  updateMonthlyChart(selectedCategory);
  
  // Reset input fields
  monthAmountInput.value = '';
});
const monthlyCtx = document.getElementById('monthlyCategoryChart').getContext('2d');
const monthlyChart = new Chart(monthlyCtx, {
type: 'bar',
data: {
labels: monthNames,
datasets: [{
label: 'Amount Spent ($)',
data: [],
backgroundColor: '#34d399',
borderRadius: 8,
}]
},
options: {
scales: {
y: {
beginAtZero: true
}
}
}
});

function updateMonthlyChart(category) {
  monthlyChart.data.datasets[0].data = monthlyData[category];
  monthlyChart.data.datasets[0].label = `Amount Spent ($) - ${category}`;
  monthlyChart.data.datasets[0].backgroundColor = categoryColorsMonthly[category] || '#a78bfa';
  monthlyChart.update();
}

const toggleThemeBtn = document.getElementById('toggle-theme');
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleThemeBtn.textContent = document.body.classList.contains('dark')
    ? '☀️ Light Mode'
    : '🌙 Dark Mode';
});

const downloadBtn = document.getElementById('download-pdf');
downloadBtn.addEventListener('click', () => {
  const element = document.getElementById('pdf-content');
  document.body.classList.add('pdf-export-mode');
  const opt = {
    margin: 0.5,
    filename: `Budget_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
  };
  html2pdf().set(opt).from(element).save().then(() => {
    document.body.classList.remove('pdf-export-mode');
  });
});
