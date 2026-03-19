// app.js
const shape = document.getElementById('shape');
const cssCode = document.getElementById('cssCode');

// State
let state = {
    size: 200, radius: 50,
    gradType: 'linear', color1: '#ff6ec7', color2: '#a855f7', angle: 135,
    blur: 30, spread: 5, shadowColor: '#a855f7',
    anim: 'none', speed: 2, paused: false
};

// Bind sliders
const bind = (id, key, unit = '') => {
    const el = document.getElementById(id);
    const label = document.getElementById(id + 'Val');
    el.addEventListener('input', () => {
        state[key] = parseFloat(el.value);
        if (label) label.textContent = el.value + unit;
        update();
    });
};

bind('size', 'size', 'px');
bind('radius', 'radius', '%');
bind('angle', 'angle', '°');
bind('blur', 'blur', 'px');
bind('spread', 'spread', 'px');
bind('speed', 'speed');  // handled specially

document.getElementById('speed').addEventListener('input', function () {
    state.speed = (55 - this.value) / 10; // invert: right = faster
    document.getElementById('speedVal').textContent = state.speed.toFixed(1) + 's';
    update();
});

['color1', 'color2', 'shadowColor'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
        state[id] = this.value; update();
    });
});

// Button groups
document.getElementById('shapeSelector').addEventListener('click', e => {
    if (!e.target.dataset.shape) return;
    document.querySelectorAll('#shapeSelector button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    update();
});
document.getElementById('gradientType').addEventListener('click', e => {
    if (!e.target.dataset.grad) return;
    document.querySelectorAll('#gradientType button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    state.gradType = e.target.dataset.grad;
    update();
});
document.getElementById('animType').addEventListener('click', e => {
    if (!e.target.dataset.anim) return;
    document.querySelectorAll('#animType button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    state.anim = e.target.dataset.anim;
    update();
});

// Pause
document.getElementById('pauseBtn').addEventListener('click', function () {
    state.paused = !state.paused;
    shape.style.animationPlayState = state.paused ? 'paused' : 'running';
    this.textContent = state.paused ? '▶ Play' : '⏸ Pause';
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
    location.reload();
});

// Copy
document.getElementById('copyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(cssCode.textContent);
    document.getElementById('copyBtn').textContent = '✅ Copied!';
    setTimeout(() => document.getElementById('copyBtn').textContent = '📋 Copy', 2000);
});

// Theme
document.getElementById('themeToggle').addEventListener('click', function () {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    this.textContent = isDark ? '🌙 Dark Mode' : '☀️ Light Mode';
});

// Core update function
function update() {
    const shapeBtn = document.querySelector('#shapeSelector .active');
    const shapeType = shapeBtn ? shapeBtn.dataset.shape : 'circle';

    // Border radius
    let br;
    if (shapeType === 'circle') br = '50%';
    else if (shapeType === 'blob') br = '60% 40% 30% 70% / 60% 30% 70% 40%';
    else br = `${state.radius}%`;

    // Gradient
    let bg;
    if (state.gradType === 'linear')
        bg = `linear-gradient(${state.angle}deg, ${state.color1}, ${state.color2})`;
    else if (state.gradType === 'radial')
        bg = `radial-gradient(circle, ${state.color1}, ${state.color2})`;
    else
        bg = `conic-gradient(from ${state.angle}deg, ${state.color1}, ${state.color2}, ${state.color1})`;

    // Shadow
    const shadow = `0 0 ${state.blur}px ${state.spread}px ${state.shadowColor}`;

    // Animation
    const animCSS = state.anim !== 'none'
        ? `${state.anim} ${state.speed}s ease-in-out infinite`
        : 'none';

    // Apply styles
    Object.assign(shape.style, {
        width: `${state.size}px`,
        height: `${state.size}px`,
        borderRadius: br,
        background: bg,
        boxShadow: shadow,
        animation: animCSS,
    });

    // Generate CSS output
    cssCode.textContent =
        `.art-shape {
  width: ${state.size}px;
  height: ${state.size}px;
  border-radius: ${br};
  background: ${bg};
  box-shadow: ${shadow};
  animation: ${animCSS};
}`;
}

update(); // init