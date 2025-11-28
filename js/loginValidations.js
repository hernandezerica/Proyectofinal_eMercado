document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("contacto");
    const passwordInput = document.getElementById("password");
    const emailLabel = document.getElementById("contactoLabel");
    const passwordLabel = document.getElementById("passwordLabel");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        // Limpiar errores previos
        clearErrors();
        
        // Validar campos
        const isValid = validateForm();
        
        if (isValid) {
            await loginWithBackend();
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

    async function loginWithBackend() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                alert('Error de login: ' + (error.error || 'Credenciales inválidas'));
                return;
            }
            
            const data = await response.json();
            
            // Guardar token y datos de usuario
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify({
                email: data.user.email,
                name: data.user.first_name + ' ' + data.user.last_name,
                id: data.user.id,
                loginTime: new Date().toISOString(),
                isLoggedIn: true
            }));
            localStorage.setItem('isLoggedIn', 'true');
            
            alert('Bienvenid@ ' + data.user.first_name + ', Redirigiendo...');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose en http://localhost:3000');
        }
    }

    function saveUserSession() {
        const data = {
            email: emailInput.value.trim(),
            name: emailInput.value.trim(),
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