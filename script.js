// script.js - Compatible con tu HTML, ENVÍO REAL + ARCHIVOS + REDIRECCIÓN GRATIS
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
    // 2. Manejo del formulario de contacto (Web3Forms)
    // ========================================
    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");

    if (contactForm && submitBtn) {
        contactForm.addEventListener("submit", function () {
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Enviando...`;
            submitBtn.disabled = true;
        });
    }

    // ========================================
    // 3. VIABILIDAD INMEDIATA - ENVÍO REAL + WHATSAPP + REDIRECCIÓN
    // ========================================
    const btnEnviar = document.getElementById("btnEnviar");
    const formViabilidad = document.getElementById("formViabilidad");
    const archivosInput = document.getElementById("archivos");
    const fileLabel = document.querySelector('.file-upload label');

    if (btnEnviar && formViabilidad) {

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

        // === ENVÍO CON BOTÓN type="button" (NO submit) ===
        btnEnviar.addEventListener('click', function () {
            const form = formViabilidad;

            // Validar producto
            const producto = document.querySelector('input[name="producto"]:checked');
            if (!producto) {
                alert('Por favor, selecciona un producto.');
                return;
            }

            // Validar campos
            if (!form.checkValidity()) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            // Validar archivo
            const files = archivosInput.files;
            if (files.length === 0) {
                alert('Por favor, adjunta al menos un documento.');
                return;
            }

            // === MENSAJE WHATSAPP ===
            const msg = `*¡VIABILIDAD INMEDIATA!*\n\n` +
                `Producto: *${producto.value}*\n` +
                `Nombre: *${form.nombre.value.trim()}*\n` +
                `Teléfono: *${form.telefono.value.trim()}*\n` +
                `${form.email.value.trim() ? `Email: ${form.email.value.trim()}\n` : ''}\n` +
                `Documentos: *${files.length} archivo(s) adjunto(s)*\n\n` +
                `Revisado GRATIS en < 24h. ¡Gracias!`;

            // Abrir WhatsApp
            window.open(`https://wa.me/34672857131?text=${encodeURIComponent(msg)}`, '_blank');

            // === CAMBIAR BOTÓN ===
            const original = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            this.disabled = true;

            // === ENVIAR FORMULARIO (ENVÍO REAL A WEB3FORMS) ===
            form.submit();

            // === REDIRIGIR A GRACIAS (GRATIS) ===
            setTimeout(() => {
                window.location.href = 'gracias.html';
            }, 1500);

            // === RESTAURAR BOTÓN ===
            setTimeout(() => {
                this.innerHTML = original;
                this.disabled = false;
            }, 3000);
        });
    }

    // ========================================
    // 4. ANIMACIONES DE ENTRADA SUAVES
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

    document.querySelectorAll('#viabilidad .producto-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    const formCard = document.querySelector('#viabilidad .card');
    if (formCard) {
        formCard.style.opacity = '0';
        formCard.style.transform = 'translateY(40px)';
        formCard.style.transition = 'all 0.7s ease 0.4s';
        observer.observe(formCard);
    }

    const title = document.querySelector('#viabilidad h2');
    const subtitle = document.querySelector('#viabilidad p');
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
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        new bootstrap.Collapse(navbarCollapse).hide();
                    }
                }
            }
        });
    });

    // ========================================
    // 6. Cerrar navbar en móvil
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
