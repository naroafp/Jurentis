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
            this.size = Math.random() * 2.5 + 1;
            this.speedX = Math.random() * 1.2 - 0.6;
            this.speedY = Math.random() * 1.2 - 0.6;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#A3D8D0';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#2E7D68';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x, this.y + this.size);
            ctx.stroke();
        }
    }

    const particleCount = window.innerWidth < 768 ? 25 : 45;
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

// === FORMULARIO CON FORMSPREE ===
const form = document.getElementById('contact-form');
if (form) {
    // REEMPLAZA CON TU ENDPOINT REAL DE FORMSPREE
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdknlkya'; // <--- AQUÍ TU ID

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        // Estado: enviando
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('btn-success');
                form.reset();
                showToast('¡Mensaje enviado! Te contactaremos en menos de 24h.', 'success');
            } else if (response.status === 429) {
                throw new Error('Rate limit');
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            const isRateLimit = error.message === 'Rate limit';
            submitBtn.innerHTML = 'Error';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-danger');

            showToast(
                isRateLimit
                    ? 'Demasiados envíos. Intenta más tarde.'
                    : 'Error al enviar. Usa WhatsApp: <a href="https://wa.me/+34672857131" style="color:white;text-decoration:underline;">+34 672 85 71 31</a>',
                'error'
            );
        } finally {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                submitBtn.className = submitBtn.className
                    .replace(/btn-(success|danger)/g, '')
                    .replace(/btn-primary/g, 'btn-primary')
                    .trim();
            }, 3000);
        }
    });
}

// === TOAST PERSONALIZADO ===
function showToast(message, type = 'success') {
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" aria-label="Cerrar">&times;</button>
    `;

    document.body.appendChild(toast);

    // Forzar reflow
    toast.offsetHeight;
    toast.classList.add('show');

    toast.querySelector('.toast-close').onclick = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    };

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 5000);
}
