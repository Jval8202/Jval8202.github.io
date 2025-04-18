const budgetForm = document.getElementById('budget-form');
const budgetInput = document.getElementById('budget-input');
const expenseForm = document.getElementById('expense-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const list = document.getElementById('expense-list');
const total = document.getElementById('total');
const remaining = document.getElementById('remaining');

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

  if (description && !isNaN(value) && value > 0) {
    // Add to list
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${description}</span>
      <span>$${value.toFixed(2)}</span>
    `;
    list.appendChild(li);
  
    // Update totals
    totalAmount += value;
    total.textContent = totalAmount.toFixed(2);
  
    // Update category totals
    if (!categories[description]) {
      categories[description] = 0;
    }
    categories[description] += value;
  
    updateRemaining();
    updateChart();
    updateCategoryChart();
  
    // Reset fields
    desc.value = '';
    amount.value = '';
  }
});

function updateRemaining() {
  const remain = budget - totalAmount;
  remaining.textContent = remain.toFixed(2);

  // Remove over-budget styles
  remaining.style.color = '';
  total.style.color = '';

  // Get alert element
  const alertBox = document.getElementById('budget-alert');
  
  if (remain < 0) {
    remaining.style.color = '#dc2626'; // red
    total.style.color = '#dc2626';

    alertBox.classList.remove('hidden');

    setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 4000);
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
        ticks: {
          stepSize: 50
        }
      }
    }
  }
});

// Function to update chart
function updateChart() {
  budgetChart.data.datasets[0].data = [budget, totalAmount];
  budgetChart.update();
}

// Track categories and amounts
const categories = {};
const categoryColors = {};

function generateColor() {
  const r = Math.floor(Math.random() * 200);
  const g = Math.floor(Math.random() * 200);
  const b = Math.floor(Math.random() * 200);
  return `rgb(${r}, ${g}, ${b})`;
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

// Update pie chart
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

const toggleThemeBtn = document.getElementById('toggle-theme');

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  // Update button text/icon based on current mode
  if (document.body.classList.contains('dark')) {
    toggleThemeBtn.textContent = '☀️ Light Mode';
  } else {
    toggleThemeBtn.textContent = '🌙 Dark Mode';
  }
});

const downloadBtn = document.getElementById('download-pdf');

downloadBtn.addEventListener('click', () => {
  const element = document.getElementById('pdf-content');

  document.body.classList.add('pdf-export-mode');

  const opt = {
    margin:       0.5,
    filename:     `Budget_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    document.body.classList.remove('pdf-export-mode');
  });
});
