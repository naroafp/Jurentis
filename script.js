// === TEMA CLARO/OSCURO ===
const toggle = document.querySelector('.theme-toggle');
toggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    toggle.textContent = document.body.classList.contains('light') ? 'Sun' : 'Moon';
});

// === PARTÍCULAS GEOMÉTRICAS (BALANZAS VERDES) ===
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1.5;
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
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.stroke();
    }
}

const particles = Array.from({ length: 35 }, () => new Particle());

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

// === SCROLL SUAVE ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// === REDIMENSIONAR CANVAS ===
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// === FORMULARIO CON FORMSPREE + FEEDBACK VISUAL ===
const form = document.querySelector('form');
const submitBtn = form.querySelector('button');
const originalText = submitBtn.textContent;

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Deshabilitar botón
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // ÉXITO
            submitBtn.textContent = 'Enviado';
            submitBtn.style.backgroundColor = '#2E7D68';
            form.reset();

            // Mostrar mensaje bonito
            showNotification('¡Gracias! Tu mensaje ha sido enviado. Te responderemos en menos de 24h.', 'success');

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        } else {
            throw new Error('Error en el envío');
        }
    } catch (error) {
        // ERROR
        submitBtn.textContent = 'Error';
        submitBtn.style.backgroundColor = '#d9534f';
        showNotification('Hubo un error. Inténtalo de nuevo o escríbenos por WhatsApp.', 'error');

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
        }, 3000);
    }
});

// === NOTIFICACIÓN FLOTANTE (TOAST) ===
function showNotification(message, type) {
    // Eliminar notificación anterior
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: ${type === 'success' ? '#2E7D68' : '#d9534f'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        font-family: 'Trebuchet MS';
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease;
    `;

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    // Eliminar después de 4 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
