// Script para manejar el formulario
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Mensaje enviado. ¡Te contactaremos pronto!');
    this.reset(); // Limpia el formulario
});