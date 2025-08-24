document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("Datos de usuario");
    const header = document.querySelector(".container");

    // Validar si hay sesión activa
    if (isLoggedIn === "true" && userData) {
        const user = JSON.parse(userData);
        console.log("Usuario autenticado:", user);
        updateUiUserLogged(user);
    } else {
        // Solo redirigir si estamos en páginas que requieren login
        const protectedPages = ['cart.html', 'my-profile.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            window.location.href = "login.html";
            return;
        }
        
        // Mostrar enlace de login si no está autenticado
        if (header) {
            const loginLink = document.createElement('a');
            loginLink.href = "login.html";
            loginLink.textContent = "Iniciar sesión";
            loginLink.style.cssText = "color: #fff; text-decoration: none; padding: 10px;";
            header.appendChild(loginLink);
        }
    }

    function updateUiUserLogged(userData) {
        if (!header) return;

        // Limpiar contenido anterior
        const existingLoginLink = header.querySelector('a[href="login.html"]');
        if (existingLoginLink) {
            existingLoginLink.remove();
        }

        // Crear elemento de bienvenida
        const welcomeElement = document.createElement('div');
        welcomeElement.textContent = `Bienvenido, ${userData.email}`;
        welcomeElement.style.cssText = `
            color: #fff;
            cursor: pointer;
            padding: 10px;
            border-radius: 5px;
            transition: background-color 0.3s;
        `;
        
        welcomeElement.addEventListener('mouseenter', () => {
            welcomeElement.style.backgroundColor = 'rgba(255,255,255,0.1)';
        });
        
        welcomeElement.addEventListener('mouseleave', () => {
            welcomeElement.style.backgroundColor = 'transparent';
        });

        welcomeElement.addEventListener('click', (e) => {
            e.preventDefault();
            showUserMenu();
        });

        header.appendChild(welcomeElement);
    }

    function showUserMenu() {
        // Verificar si ya existe un menú
        const existingMenu = document.querySelector(".user-menu");
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        // Crear menú de usuario
        const userMenu = document.createElement('div');
        userMenu.classList.add("user-menu");
        userMenu.style.cssText = `
            position: absolute;
            top: 60px;
            right: 20px;
            background: #333;
            border: 1px solid #555;
            border-radius: 8px;
            padding: 0;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            min-width: 200px;
        `;

        userMenu.innerHTML = `
            <ul style="
                list-style: none;
                margin: 0;
                padding: 0;
                color: #fff;
            ">
                <li><a href="my-profile.html" class="menu-item">Ver perfil</a></li>
                <li><a href="#" class="menu-item" id="logout-btn">Cerrar sesión</a></li>
            </ul>
        `;

        // Agregar estilos a los elementos del menú
        const style = document.createElement('style');
        style.textContent = `
            .menu-item {
                display: block;
                color: #fff;
                text-decoration: none;
                padding: 12px 16px;
                transition: background-color 0.3s;
                border-bottom: 1px solid #555;
            }
            .menu-item:hover {
                background-color: #555;
            }
            .menu-item:last-child {
                border-bottom: none;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(userMenu);

        // Agregar event listener al botón de logout
        const logoutButton = userMenu.querySelector("#logout-btn");
        if (logoutButton) {
            logoutButton.addEventListener("click", function (e) {
                e.preventDefault();
                logout();
            });
        }

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function closeMenu(e) {
            if (!userMenu.contains(e.target) && !e.target.closest('.container')) {
                userMenu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }

    function logout() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("Datos de usuario");
        window.location.href = "login.html";
    }

    // TODO: ELIMINAR ESTE BLOQUE - Lógica temporal para ocultar elementos en página de login
    // Esta funcionalidad se debe quitar una vez que se refactorice el header/navegación
    // Ya que al estar en login no debería mostrar el bloque de bienvenida
    function hideElementsInLogin() {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'login.html') {
            // Si hay sesión activa, redirigir al index
            if (isLoggedIn === "true" && userData) {
                window.location.href = "index.html";
                return;
            }
            
            // Ocultar solo los elementos de navegación/sesión agregados dinámicamente
            const welcomeElements = document.querySelectorAll('[style*="Bienvenido"]');
            welcomeElements.forEach(element => {
                element.style.display = 'none';
            });
            
            // Ocultar enlaces de login que se agreguen dinámicamente
            const loginLinks = header ? header.querySelectorAll('a[href="login.html"]') : [];
            loginLinks.forEach(link => {
                link.style.display = 'none';
            });
            
            // Ocultar cualquier menú de usuario que pueda estar visible
            const existingMenu = document.querySelector(".user-menu");
            if (existingMenu) {
                existingMenu.remove();
            }
            
            // Ocultar elementos de bienvenida específicos que se crean dinámicamente
            const dynamicWelcome = header ? header.querySelector('[style*="Bienvenido"]') : null;
            if (dynamicWelcome) {
                dynamicWelcome.style.display = 'none';
            }
        }
    }
    
    // Ejecutar la función para ocultar elementos en login
    hideElementsInLogin();
});