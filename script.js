// script.js - Compatible con tu HTML actual
document.addEventListener("DOMContentLoaded", function () {
    // ========================================
    // 1. Partículas en el Hero (opcional, si usas canvas)
    // ========================================
    const canvas = document.getElementById("particles-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        const particleCount = 80;

        // Ajustar canvas al tamaño de la sección hero
        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Crear partícula
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

        // Inicializar partículas
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animación
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
    // 2. Manejo del formulario (AJAX + fallback)
    // ========================================
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const fallbackBanner = document.getElementById("whatsapp-fallback");

    if (form && submitBtn) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault(); // Evita envío normal

            // Cambiar botón a "Enviando..."
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Enviando...`;
            submitBtn.disabled = true;

            try {
                const formData = new FormData(form);

                const response = await fetch(form.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json"
                    }
                });

                if (response.ok) {
                    // ÉXITO: Redirige a gracias.html (aunque _next ya lo hace)
                    window.location.href = "https://jurentis.es/gracias.html";
                } else {
                    throw new Error("Error en el servidor");
                }
            } catch (error) {
                // FALLBACK: Mostrar WhatsApp si falla
                if (fallbackBanner) {
                    fallbackBanner.classList.remove("d-none");
                }
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ========================================
    // 3. Scroll suave para anclas internas
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80, // Ajuste por navbar fijo
                    behavior: "smooth"
                });
            }
        });
    });

    // ========================================
    // 4. Cerrar navbar en móvil al hacer clic
    // ========================================
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });
});
