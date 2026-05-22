const TOTAL = WORDS.length;
let lo, hi, mid, guessCount, mode, lastPctTop, lastPctBottom;

function startSolver(selectedMode) {
  mode = selectedMode;
  document.getElementById('mode-select').classList.add('hidden');
  document.getElementById('solver').classList.remove('hidden');
  if (mode === 'binary') {
    document.getElementById('pct-top-wrap').classList.add('hidden');
    document.getElementById('pct-bottom-wrap').classList.add('hidden');
  }
  lo = 0;
  hi = TOTAL - 1;
  mid = Math.floor((lo + hi) / 2);
  guessCount = 0;
  lastPctTop = '';
  lastPctBottom = '';
  render();
}

function render() {
  document.getElementById('guess').textContent = WORDS[mid];
  document.getElementById('bound-top').textContent = WORDS[lo];
  document.getElementById('bound-bottom').textContent = WORDS[hi];
  document.getElementById('words-left').textContent = `${hi - lo + 1} words left | Guess #${guessCount + 1}`;
  document.getElementById('status').textContent = '';
  document.getElementById('pct-top').value = lastPctTop;
  document.getElementById('pct-bottom').value = lastPctBottom;
}

function nextGuess(direction) {
  if (mode === 'interpolation') {
    const top = document.getElementById('pct-top').value;
    const bottom = document.getElementById('pct-bottom').value;
    if (top === '' || bottom === '') {
      document.getElementById('status').textContent = 'Enter both percentages';
      return;
    }
  }

  guessCount++;

  lastPctTop = document.getElementById('pct-top').value;
  lastPctBottom = document.getElementById('pct-bottom').value;

  const pctTop = parseFloat(lastPctTop);
  const pctBottom = parseFloat(lastPctBottom);

  if (direction === 'up') {
    hi = mid;
  } else {
    lo = mid;
  }

  if (hi - lo <= 1) {
    mid = hi;
    render();
    return;
  }

  if (mode === 'interpolation' && !isNaN(pctTop) && !isNaN(pctBottom)) {
    const offset = Math.round((pctTop / (pctTop + pctBottom)) * (hi - lo));
    mid = clamp(lo + offset, lo + 1, hi - 1);
  } else {
    mid = Math.floor((lo + hi) / 2);
  }

  render();
}

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function resetSolver() {
  document.getElementById('mode-select').classList.remove('hidden');
  document.getElementById('solver').classList.add('hidden');
}

document.getElementById('mode-interpolation').addEventListener('click', () => startSolver('interpolation'));
document.getElementById('mode-binary').addEventListener('click', () => startSolver('binary'));
document.getElementById('btn-up').addEventListener('click', () => nextGuess('up'));
document.getElementById('btn-down').addEventListener('click', () => nextGuess('down'));
document.getElementById('btn-correct').addEventListener('click', () => {
  guessCount++;
  document.getElementById('status').textContent = `Found in ${guessCount} guesses!`;
});
document.getElementById('reset').addEventListener('click', resetSolver);
