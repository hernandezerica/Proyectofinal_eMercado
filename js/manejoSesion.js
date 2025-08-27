document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("Datos de usuario");
    const header = document.querySelector(".container");


    // Validar si hay sesión activa
    if (isLoggedIn === "true" && userData) {
        const user = JSON.parse(userData);
        console.log("Usuario autenticado:", user);
    }



    const currentPage = window.location.pathname.split('/').pop();

    //verificar si usuario esta en login
    if (currentPage === 'login.html') {


        // Si hay sesión activa, redirigir al index
        if (isLoggedIn === "true" && userData) {
            window.location.href = "index.html";
            return;
        }
        // Si no hay sesión activa, permanecer en login.html
        return;
    }

    // cerrar sesión.
    function logout() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("Datos de usuario");
        window.location.href = "login.html";
    }

});
