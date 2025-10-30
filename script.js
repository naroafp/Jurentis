// === PARTÍCULAS EN HERO ===
const canvas = document.getElementById('particles-canvas');
const ctx = canvas?.getContext('2d');
const heroSection = document.getElementById('inicio');

if (canvas && ctx && heroSection) {
    const resizeCanvas = () => {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    };
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
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
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x, this.y + this.size);
            ctx.stroke();
        }
    }

    const particleCount = window.innerWidth < 768 ? 25 : 50;
    const particles = Array.from({ length: particleCount }, () => new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    // Redimensionar con debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100);
    });
}

// === SCROLL SUAVE ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// === FORMULARIO CON FORMSPREE + TOAST ===
const form = document.getElementById('contact-form');
if (form) {
    // === CAMBIA ESTO POR TU ENDPOINT REAL ===
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdknlkya'; // ← TU ID AQUÍ

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Estado: enviando
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Enviando...
        `;

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                submitBtn.innerHTML = 'Enviado';
                submitBtn.classList.add('btn-success');
                form.reset();
                showToast('¡Gracias! Te responderemos en menos de 24h.', 'success');
            } else if (response.status === 429) {
                throw new Error('Rate limit');
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            const isRateLimit = error.message === 'Rate limit';
            submitBtn.innerHTML = 'Error';
            submitBtn.classList.add('btn-danger');

            showToast(
                isRateLimit
                    ? 'Demasiados envíos. Intenta más tarde.'
                    : 'Error al enviar. Usa WhatsApp: +34 672 85 71 31',
                'error'
            );
        } finally {
            // Restaurar botón tras 3 segundos
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.className = submitBtn.className
                    .replace(/btn-(success|danger)/g, '')
                    .trim();
            }, 3000);
        }
    });
}

// === TOAST PERSONALIZADO ===
function showToast(message, type = 'success') {
    // Eliminar toast anterior
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : '✕'}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;

    document.body.appendChild(toast);

    // Forzar reflow
    toast.offsetHeight;

    toast.classList.add('show');

    // Cerrar al hacer clic
    toast.querySelector('.toast-close').onclick = () => toast.remove();

    // Auto-cerrar
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 5000);
}
