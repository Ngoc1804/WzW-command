const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// DEMO-1 V12 (9e54f6a) timing, with the approved horizontal ribbon alignment.
function section(source, start, end) {
  const first = source.indexOf(start);
  const last = source.indexOf(end, first);
  assert(first >= 0 && last > first, 'Missing shared footstep implementation');
  return source.slice(first, last);
}

function element() {
  return {
    dataset: {},
    children: [],
    attributes: {},
    style: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    append(child) { this.children.push(child); },
    replaceChildren() { this.children = []; }
  };
}

const sources = ['examples/WIZAMAP_FIXED_UI.html', 'dist/bundle.js'];
let canonical;
for (const file of sources) {
  const source = fs.readFileSync(file, 'utf8');
  const code = section(source, 'function addUse(', 'function tagType(') +
    section(source, 'function feetState(', '// Approved Fixed artwork;');
  if (canonical) assert.equal(code, canonical, 'Published bundle diverges from shared source');
  canonical = code;
  const tokens = vm.runInNewContext(section(source, 'const TOKENS=', 'const NS=') + ';TOKENS');
  assert.equal(tokens.motion.steps, 6);
  assert.equal(tokens.motion.stepMs, 550);
  assert.equal(tokens.motion.hideMs, 2000);
  const reduced = {matches: false};
  const timers = new Set();
  let now = 0;
  const context = {
    TOKENS: tokens, NS: 'http://www.w3.org/2000/svg',
    document: {createElementNS: element, hidden: false, body: {classList: {contains: () => false}}},
    matchMedia: () => reduced,
    performance: {now: () => now},
    setInterval(callback) { timers.add(callback); return callback; },
    clearInterval(callback) { timers.delete(callback); }
  };
  const api = vm.runInNewContext(code + ';({setupFeet, feetState, mountFeet})', context);
  for (let elapsed = 0; elapsed <= 10600; elapsed++) {
    const values = Array.from(api.feetState(elapsed, 'walk'));
    const phase = elapsed % 5300;
    assert.equal(values.filter(value => value === 1).length, phase < 3300 ? 1 : 0);
    assert(values.every(value => value === 0 || value === 1), 'Walking leaves residual ink');
    if (phase < 3300) assert.equal(values.indexOf(1), Math.floor(phase / 550));
  }
  const walking = element();
  const stopWalking = api.mountFeet(walking, 'walk');
  assert.equal(walking.children.length, 6);
  assert.deepEqual(walking.children.map(shoe => shoe.attributes.href.slice(-1)), ['l', 'r', 'l', 'r', 'l', 'r']);
  let previousX = -Infinity;
  for (const shoe of walking.children) {
    const values = shoe.attributes.transform.match(/-?[\d.]+/g).map(Number);
    const [x, y, angle] = values;
    assert(x > previousX, 'Walking must progress left to right');
    assert(Math.abs(y) <= 7 && angle > 80 && angle < 100, 'Shoe must face along the lower ribbon edge');
    previousX = x;
  }
  const idle = element();
  const stopIdle = api.mountFeet(idle, 'idle');
  assert.equal(idle.children.length, 2);
  assert.equal(timers.size, 1, 'All actors must share one timer');
  const tick = time => { now = time; for (const callback of timers) callback(); };
  tick(3300);
  assert(walking.children.every(shoe => shoe.style.opacity === '0'), 'Pause must fully hide the walking marks');
  tick(5300);
  assert.equal(walking.children.filter(shoe => shoe.style.opacity === '1').length, 1);
  reduced.matches = true;
  tick(5400);
  assert.equal(walking.children.length, 2);
  assert(walking.children.every(shoe => shoe.style.opacity === '0.78'));
  reduced.matches = false;
  tick(5500);
  assert.equal(walking.children.length, 6, 'Normal walking must resume after reduced motion');
  assert(api.feetState(800)[0] > api.feetState(800)[1]);
  assert(api.feetState(2400)[0] < api.feetState(2400)[1]);
  const hidden = element();
  api.mountFeet(hidden, 'hidden')();
  assert.equal(hidden.children.length, 0);
  stopWalking();
  assert.equal(timers.size, 1);
  stopIdle();
  assert.equal(timers.size, 0, 'Scene disposal must release the animation timer');
  console.log('PASS ' + file + ': horizontal steps, 10601 times, pause, idle, reduced motion and cleanup');
}
