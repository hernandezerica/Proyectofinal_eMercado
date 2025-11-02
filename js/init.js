const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
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
