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
        constructor() { this.reset(); }
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
        particles.forEach(p => { p.update(); p.draw(); });
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

// === FORMULARIO CON REDIRECCIÓN A GRACIAS.HTML (USANDO _next) ===
const form = document.getElementById('contact-form');
if (form) {
    // REDIRIGE AUTOMÁTICAMENTE A TU PÁGINA GRACIAS.HTML
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xyzbpaeq?_next=gracias.html';
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Estado: enviando
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status"></span>
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
                // Éxito
                submitBtn.classList.remove('error');
                submitBtn.classList.add('success');
                submitBtn.innerHTML = 'Enviado';
                form.reset();

                // Toast antes de que Formspree redirija
                showToast('¡Mensaje enviado! Redirigiendo...', 'success');

                // Formspree redirige automáticamente a gracias.html
                // No necesitamos window.location.href
            } else {
                throw new Error('Error del servidor');
            }
        } catch (error) {
            // Error de red o servidor
            submitBtn.classList.remove('success');
            submitBtn.classList.add('error');
            submitBtn.innerHTML = 'Error';

            showToast('Error al enviar. Usa WhatsApp: +34 672 85 71 31', 'error');

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('success', 'error');
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
            <span class="toast-icon">${type === 'success' ? 'Check' : 'Cross'}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" aria-label="Cerrar">&times;</button>
    `;

    document.body.appendChild(toast);
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
