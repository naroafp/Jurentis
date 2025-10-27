// TEMA
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeToggle.textContent = document.body.classList.contains('light') ? 'Sun' : 'Moon';
    themeToggle.setAttribute('aria-pressed', document.body.classList.contains('light')); // Accesibilidad
});

// PARTÍCULAS
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
const heroSection = document.getElementById('inicio');

// Ajustar tamaño del canvas a la sección hero
canvas.width = heroSection.offsetWidth;
canvas.height = heroSection.offsetHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(163, 216, 208, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(46, 125, 104, 0.3)';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.stroke();
    }
}

// Ajustar número de partículas según tamaño de pantalla
const particleCount = window.innerWidth < 768 ? 20 : 40;
const particles = Array.from({ length: particleCount }, () => new Particle());

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

// Redimensionamiento con limitador
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }, 100);
});

// SCROLL SUAVE
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// FORMSPREE + TOAST
const form = document.getElementById('contact-form');
form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            btn.textContent = 'Enviado';
            btn.style.backgroundColor = '#2E7D68';
            form.reset();
            showToast('¡Gracias! Te responderemos en menos de 24h.', 'success');
        } else if (res.status === 429) {
            btn.textContent = 'Error';
            btn.style.backgroundColor = '#d9534f';
            showToast('Demasiados envíos. Intenta de nuevo más tarde.', 'error');
        } else {
            throw new Error();
        }
    } catch {
        btn.textContent = 'Error';
        btn.style.backgroundColor = '#d9534f';
        showToast('Error. Intenta de nuevo o usa WhatsApp.', 'error');
    } finally {
        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
            btn.style.backgroundColor = '';
        }, 3000);
    }
});

function showToast(msg, type) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.setAttribute('role', 'alert'); // Accesibilidad
    toast.setAttribute('aria-live', 'assertive'); // Accesibilidad
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = '1', 100);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
