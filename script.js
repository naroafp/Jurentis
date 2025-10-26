// TEMA
document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    this.textContent = document.body.classList.contains('light') ? 'Sun' : 'Moon';
});

// PARTÍCULAS
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(163, 216, 208, 0.4)';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(46, 125, 104, 0.3)';
        ctx.beginPath(); ctx.moveTo(this.x, this.y - this.size); ctx.lineTo(this.x, this.y + this.size); ctx.stroke();
    }
}
const particles = Array.from({ length: 40 }, () => new Particle());
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

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
    btn.disabled = true; btn.textContent = 'Enviando...';

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            btn.textContent = 'Enviado'; btn.style.backgroundColor = '#2E7D68';
            form.reset();
            showToast('¡Gracias! Te responderemos en menos de 24h.', 'success');
        } else throw new Error();
    } catch {
        btn.textContent = 'Error'; btn.style.backgroundColor = '#d9534f';
        showToast('Error. Intenta de nuevo o usa WhatsApp.', 'error');
    } finally {
        setTimeout(() => { btn.textContent = original; btn.disabled = false; btn.style.backgroundColor = ''; }, 3000);
    }
});

function showToast(msg, type) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = '1', 100);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 4000);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
