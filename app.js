/* ---------- grab elements ---------- */
const cost      = document.getElementById('cost');
const years     = document.getElementById('years');
const yrsLabel  = document.getElementById('yearsLabel');
const rate      = document.getElementById('rate');
const calcBtn   = document.getElementById('calcBtn');
const resultEl  = document.getElementById('result');
const shareBtn  = document.getElementById('share');
const ctx       = document.getElementById('chart');
const labels    = Array.from({ length: 30 }, (_, i) => i + 1);

/* ---------- chart ---------- */
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [{
      data: [],
      fill: true,
      tension: 0.25,
      backgroundColor: 'rgba(0,123,255,.2)',
      borderWidth: 2
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales : { y: { ticks: { callback: v => '$' + v.toLocaleString() } } }
  }
});

/* ---------- helpers ---------- */
// future-value of daily contribution (ordinary annuity)
const fv = (c, n, r) => c * 365 * ((Math.pow(1 + r, n) - 1) / r);

// nice count-up animation for the result
function animateValue(el, start, end, dur = 800) {
  const startTime = performance.now();
  function tick(now) {
    const p = Math.min((now - startTime) / dur, 1);
    const val = Math.floor(start + (end - start) * p);
    el.textContent = '$' + val.toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- main calculation ---------- */
function calculate() {
  const c = parseFloat(cost.value) || 0;
  const n = parseInt(years.value, 10);
  const r = parseFloat(rate.value);

  yrsLabel.textContent = n;

  const future = fv(c, n, r);
  const spent  = c * 365 * n;

  // chart
  chart.data.datasets[0].data = labels.map(y => fv(c, y, r));
  chart.update();

  // bars
  const pctSpent = (spent / future) * 100;
  document.getElementById('spentBar' ).style.width = pctSpent + '%';
  document.getElementById('futureBar').style.width = '100%';

  // animate number
  const current = Number(resultEl.textContent.replace(/[^0-9]/g, '')) || 0;
  animateValue(resultEl, current, future);

  // share link
  const msg = encodeURIComponent(
    `Skipping my $${c.toFixed(2)} latte for ${n} years could grow into $${future.toLocaleString()}.`
  );
  shareBtn.href = `https://twitter.com/intent/tweet?text=${msg}&url=${location.href}`;
}

/* ---------- init & events ---------- */
calculate();
[cost, years, rate].forEach(el => el.addEventListener('input', calculate));
calcBtn.addEventListener('click', calculate);

// dark-mode toggle
document.getElementById('modeToggle')
  .addEventListener('click', () =>
    document.documentElement.classList.toggle('dark'));
