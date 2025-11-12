document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("contacto");
    const passwordInput = document.getElementById("password");
    const emailLabel = document.getElementById("contactoLabel");
    const passwordLabel = document.getElementById("passwordLabel");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Limpiar errores previos
        clearErrors();
        
        // Validar campos
        const isValid = validateForm();
        
        if (isValid) {
            saveUserSession();
            redirectToHome();
        }
    });

    function clearErrors() {
        const errorElements = [emailInput, passwordInput];
        const labelElements = [emailLabel, passwordLabel];
        const messageElements = [emailError, passwordError];
        
        errorElements.forEach(element => element.classList.remove("error-input"));
        labelElements.forEach(element => element.classList.remove("error-label"));
        messageElements.forEach(element => element.style.display = "none");
    }

    function validateForm() {
        let isValid = true;
        
        // Validar email
        if (!emailInput.value.trim()) {
            showError(emailInput, emailLabel, emailError, "Campo vacío");
            isValid = false;
        }
        
        // Validar contraseña
        if (!passwordInput.value.trim()) {
            showError(passwordInput, passwordLabel, passwordError, "Campo vacío");
            isValid = false;
        }
        
        return isValid;
    }

    function showError(input, label, errorElement, message) {
        input.classList.add("error-input");
        label.classList.add("error-label");
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }

    function saveUserSession() {
        const data = {
            email: emailInput.value.trim(), // Cambiado de 'name' a 'email' para consistencia
            name: emailInput.value.trim(),  // También mantener 'name' para compatibilidad
            loginTime: new Date().toISOString(),
            isLoggedIn: true
        };
        
        localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem("isLoggedIn", "true");
    }

    function redirectToHome() {
        alert("Bienvenid@, Redirigiendo...");
        window.location.href = "index.html";
    }
});