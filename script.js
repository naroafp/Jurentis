// script.js - Compatible con tu HTML y REDIRECCIÓN a gracias.html
document.addEventListener("DOMContentLoaded", function () {
    // ========================================
    // 1. Partículas en el Hero (opcional)
    // ========================================
    const canvas = document.getElementById("particles-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        const particleCount = 80;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1.5 - 0.75;
                this.speedY = Math.random() * 1.5 - 0.75;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ========================================
    // 2. Manejo del formulario (SIN AJAX → DEJA QUE FORMSPREE REDIRIGA)
    // ========================================
    // ¡IMPORTANTE! No usamos AJAX para que _next funcione
    // Solo mostramos "Enviando..." y deshabilitamos el botón
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const fallbackBanner = document.getElementById("whatsapp-fallback");

    if (form && submitBtn) {
        form.addEventListener("submit", function () {
            // Cambiar botón a "Enviando..."
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Enviando...`;
            submitBtn.disabled = true;

            // DEJAMOS QUE EL ENVÍO SEA NATIVO (Formspree manejará _next)
            // No hacemos fetch, no hacemos preventDefault
        });

        // Si hay error (Formspree devuelve error), mostramos fallback
        // (Esto solo se activa si el usuario regresa o hay problema)
        window.addEventListener("pageshow", function () {
            if (fallbackBanner && !fallbackBanner.classList.contains("d-none")) {
                submitBtn.innerHTML = "Enviar Consulta";
                submitBtn.disabled = false;
            }
        });
    }

    // ========================================
    // 3. Scroll suave para anclas internas
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href === "#" || href.startsWith("#")) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // ========================================
    // 4. Cerrar navbar en móvil al hacer clic
    // ========================================
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });
});
