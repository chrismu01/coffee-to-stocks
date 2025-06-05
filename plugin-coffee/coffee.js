document.addEventListener('DOMContentLoaded', () => {
  const cost = document.getElementById('c2s_cost');
  const yrs  = document.getElementById('c2s_years');
  const lbl  = document.getElementById('c2s_years_lbl');
  const ctx  = document.getElementById('c2s_chart');

  const labels = Array.from({ length: 30 }, (_, i) => i + 1);

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { data: [], fill: true, tension: 0.25 }
      ]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: {
            callback: v => '$' + v.toLocaleString()
          }
        }
      }
    }
  });

  const fv = (c, n, r = 0.08) =>
    c * 365 * ( (Math.pow(1 + r, n) - 1) / r );

  function update() {
    lbl.textContent = yrs.value;
    const c = parseFloat(cost.value);
    chart.data.datasets[0].data = labels.map(y => fv(c, y));
    chart.update();
  }

  cost.oninput = yrs.oninput = update;
  update();
});
