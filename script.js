// script.js - Compatible con tu HTML, REDIRECCIÓN a gracias.html + VIABILIDAD INMEDIATA
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
    // 2. Manejo del formulario de contacto (Formspree)
    // ========================================
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const fallbackBanner = document.getElementById("whatsapp-fallback");

    if (form && submitBtn) {
        form.addEventListener("submit", function () {
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Enviando...`;
            submitBtn.disabled = true;
        });

        window.addEventListener("pageshow", function () {
            if (fallbackBanner && !fallbackBanner.classList.contains("d-none")) {
                submitBtn.innerHTML = "Enviar Consulta";
                submitBtn.disabled = false;
            }
        });
    }

    // ========================================
    // 3. VIABILIDAD INMEDIATA - ENVÍO POR WHATSAPP
    // ========================================
    const viabilidadForm = document.getElementById("formViabilidad");
    const archivosInput = document.getElementById("archivos");
    const fileLabel = document.querySelector('.file-upload label');

    if (viabilidadForm) {
        // Contador de archivos
        archivosInput?.addEventListener('change', function () {
            const count = this.files.length;
            fileLabel.textContent = count > 0 
                ? `Seleccionados: ${count} archivo${count > 1 ? 's' : ''}` 
                : 'Subir contrato, extracto o factura (PDF o foto)';
        });

        // Efecto visual al seleccionar producto
        document.querySelectorAll('.producto-card').forEach(card => {
            card.addEventListener('click', function () {
                document.querySelectorAll('.producto-card').forEach(c => {
                    c.classList.remove('border-primary', 'bg-primary-subtle', 'shadow');
                });
                this.classList.add('border-primary', 'bg-primary-subtle', 'shadow');
            });
        });

        // Envío por WhatsApp
        viabilidadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const form = e.target;
            if (!form.checkValidity()) {
                alert('Por favor, completa todos los campos obligatorios');
                return;
            }

            const producto = document.querySelector('input[name="producto"]:checked');
            if (!producto) {
                alert('Por favor, selecciona un producto');
                return;
            }

            const files = archivosInput.files;
            if (files.length === 0) {
                alert('Por favor, sube al menos un documento');
                return;
            }

            const msg = `*¡VIABILIDAD INMEDIATA!*\n\n` +
                `Producto: *${producto.value}*\n` +
                `Nombre: *${form.nombre.value}*\n` +
                `Teléfono: *${form.telefono.value}*\n` +
                `${form.email.value ? `Email: ${form.email.value}\n` : ''}\n` +
                `Documentos: *${files.length} archivo(s) adjunto(s)*\n\n` +
                `Revisad GRATIS en < 24h. ¡Gracias!`;

            const whatsappURL = `https://wa.me/34672857131?text=${encodeURIComponent(msg)}`;
            window.open(whatsappURL, '_blank');

            // Feedback visual
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = 'Enviado!';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    form.reset();
                    document.querySelectorAll('.producto-card').forEach(c => {
                        c.classList.remove('border-primary', 'bg-primary-subtle', 'shadow');
                    });
                    fileLabel.textContent = 'Subir contrato, extracto o factura (PDF o foto)';
                }, 2000);
            }, 1000);
        });
    }

    // ========================================
    // 4. ANIMACIONES DE ENTRADA SUAVES (sin AOS)
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animar productos
    document.querySelectorAll('#viabilidad .producto-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Animar formulario
    const formCard = document.querySelector('#viabilidad .card');
    if (formCard) {
        formCard.style.opacity = '0';
        formCard.style.transform = 'translateY(40px)';
        formCard.style.transition = 'all 0.7s ease 0.4s';
        observer.observe(formCard);
    }

    // Animar título y subtítulo
    const title = document.querySelector('#viabilidad h2');
    const subtitle = document.querySelector('#viabilidad .lead');
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = 'all 0.6s ease';
        observer.observe(title);
    }
    if (subtitle) {
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(20px)';
        subtitle.style.transition = 'all 0.6s ease 0.2s';
        observer.observe(subtitle);
    }

    // ========================================
    // 5. Scroll suave para anclas internas
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href === "#" || href.startsWith("#")) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({
                        top: target.offsetTop - 90,
                        behavior: "smooth"
                    });
                    // Cerrar navbar en móvil
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        new bootstrap.Collapse(navbarCollapse).hide();
                    }
                }
            }
        });
    });

    // ========================================
    // 6. Cerrar navbar en móvil al hacer clic
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
