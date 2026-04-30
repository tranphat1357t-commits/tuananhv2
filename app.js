let particlesEnabled = true;
let menuMinimized = false;
let performanceInterval;

const featureStates = {
    head: false,
    shoulder: false,
    arms: false,
    torso: false,
    legs: false,
    esp: false,
    speed: false,
    recoil: false,
    wallhack: false,
    autofire: false
};

let volumeSlider;

document.addEventListener('DOMContentLoaded', function() {

    volumeSlider = document.getElementById('volume-slider');

    initializeFeatures();
    initializeSettings();
    startPerformanceMonitor();
    setupEventListeners();
    loadConfiguration();

    showNotification('Panel loaded successfully!', 'success');
});


// ================= FEATURES =================

function initializeFeatures() {
    document.querySelectorAll('.toggle-input').forEach(toggle => {
        toggle.addEventListener('change', function() {

            const featureName =
                this.nextElementSibling?.getAttribute('data-feature') ||
                this.id.replace('aim-', '').replace('-', '');

            handleFeatureToggle(featureName, this.checked, this);
        });
    });
}

function handleFeatureToggle(featureName, enabled, element) {

    featureStates[featureName] = enabled;

    updateTargetDots(featureName, enabled);

    const status = enabled ? 'ON' : 'OFF';

    showNotification(`${featureName.toUpperCase()} ${status}`, enabled ? 'success' : 'warning');

    createRippleEffect(element.parentElement);

    saveConfiguration();
}

function updateTargetDots(featureName, enabled) {

    const map = {
        head: ['.head-dot'],
        shoulder: ['.shoulder-dot'],
        arms: ['.arm-left-dot', '.arm-right-dot'],
        torso: ['.torso-dot'],
        legs: ['.leg-left-dot', '.leg-right-dot']
    };

    map[featureName]?.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.classList.toggle('active', enabled);
    });
}


// ================= UI EFFECT =================

function createRippleEffect(element) {

    const ripple = document.createElement('div');

    ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:hsla(240,100%,50%,0.3);
        transform:scale(0);
        animation:ripple 0.6s linear;
        pointer-events:none;
    `;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size / 2 + 'px';
    ripple.style.marginTop = -size / 2 + 'px';

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}


// ================= SETTINGS =================

function initializeSettings() {

    document.getElementById('theme-select').addEventListener('change', e => {
        changeTheme(e.target.value);
    });

    document.getElementById('particles-toggle').addEventListener('change', e => {
        particlesEnabled = e.target.checked;
    });

    document.getElementById('opacity-slider').addEventListener('input', e => {
        document.querySelector('.menu-container').style.opacity = e.target.value / 100;
    });
}

function changeTheme(theme) {
    document.body.className = theme !== 'default' ? `theme-${theme}` : '';
}


// ================= MENU =================

function toggleSettings() {
    document.getElementById('settings-panel').classList.toggle('active');
}

function minimizeMenu() {
    const menu = document.querySelector('.menu-container');

    if (menuMinimized) {
        menu.style.transform = 'scale(1)';
        menu.style.opacity = '1';
    } else {
        menu.style.transform = 'scale(0.8)';
        menu.style.opacity = '0.7';
    }

    menuMinimized = !menuMinimized;
}


// ================= PERFORMANCE =================

function startPerformanceMonitor() {
    performanceInterval = setInterval(updatePerformanceMetrics, 1000);
}

function updatePerformanceMetrics() {

    const cpu = Math.floor(Math.random() * 30) + 35;
    const fps = Math.floor(Math.random() * 20) + 130;
    const ping = Math.floor(Math.random() * 15) + 20;

    document.getElementById('cpu-usage').textContent = cpu + '%';
    document.getElementById('fps-counter').textContent = fps;
    document.getElementById('ping-value').textContent = ping + 'ms';
}


// ================= CONFIG =================

function saveConfiguration() {
    localStorage.setItem('config', JSON.stringify({
        features: featureStates
    }));
}

function loadConfiguration() {

    const data = localStorage.getItem('config');
    if (!data) return;

    const config = JSON.parse(data);

    Object.keys(config.features || {}).forEach(f => {
        const el = document.getElementById(`aim-${f}`);
        if (el) {
            el.checked = config.features[f];
            updateTargetDots(f, config.features[f]);
        }
    });
}


// ================= NOTIFICATION =================

function showNotification(msg, type = 'info') {

    const box = document.createElement('div');

    box.className = `notification ${type}`;
    box.innerText = msg;

    const container = document.getElementById('notification-container');
    container.appendChild(box);

    setTimeout(() => box.remove(), 3000);
}


// ================= EVENTS =================

function setupEventListeners() {

    document.addEventListener('keydown', e => {

        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveConfiguration();
            showNotification('Saved', 'success');
        }

        if (e.key === 'Escape') {
            document.getElementById('settings-panel').classList.remove('active');
        }
    });
}


// ================= CLEANUP =================

window.addEventListener('beforeunload', () => {
    clearInterval(performanceInterval);
});
