// Base cambiada para apuntar al backend local protegido con JWT
const API_BASE = "http://localhost:3000";
const CATEGORIES_URL = API_BASE + "/cats";
const PUBLISH_PRODUCT_URL = API_BASE + "/sell/publish.json";
const PRODUCTS_URL = API_BASE + "/cats_products/";
const PRODUCT_INFO_URL = API_BASE + "/products/";
const PRODUCT_INFO_COMMENTS_URL = API_BASE + "/products_comments/";
const CART_INFO_URL = API_BASE + "/user_cart/";
const CART_BUY_URL = API_BASE + "/cart/buy.json";
const EXT_TYPE = ""; // Quitado .json porque el backend no lo necesita

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // Si hay token, agregarlo al header
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }
    
    return fetch(url, { headers })
    .then(response => {
      if (response.status === 401) {
        // Token inválido o expirado
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.setItem('isLoggedIn', 'false');
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        window.location.href = 'login.html';
        throw Error('Unauthorized');
      }
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// ============================================
// ¡DESAFIATE! - Autor: Máximo Gallo
// Función global que actualiza el badge del carrito en todas las páginas
// Muestra la cantidad total de productos
// ============================================
function actualizarBadgeCarrito() {
  // Obtener productos del carrito
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Calcular cantidad total de productos
  let totalProductos = 0;
  cartItems.forEach(function(producto) {
    totalProductos += producto.quantity;
  });
  
  // Obtener el elemento del badge
  let badge = document.getElementById('cart-badge');
  
  if (badge) {
    if (totalProductos > 0) {
      // Si hay productos, mostrar el badge con la cantidad
      badge.textContent = totalProductos;
      badge.style.display = 'inline-block';
    } else {
      // Si no hay productos, ocultar el badge
      badge.style.display = 'none';
    }
  }
}

// ============================================
// ¡DESAFIATE! - Autor: Máximo Gallo
// Actualizar badge del carrito al cargar cualquier página
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  actualizarBadgeCarrito();
});
