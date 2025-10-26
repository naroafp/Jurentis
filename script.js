document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        alert('¡Gracias por tu mensaje, ' + name + '! Te contactaremos pronto.');
        this.reset(); // Limpia el formulario
    } else {
        alert('Por favor, completa todos los campos.');
    }
});
