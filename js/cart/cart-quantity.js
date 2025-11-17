// ============================================
// CART-QUANTITY.JS - MANEJO DE CANTIDADES
// ============================================
// Este módulo gestiona todas las operaciones relacionadas
// con las cantidades de productos en el carrito
// Autor: Máximo Gallo
// ============================================

(function() {
  'use strict';
  
  // ============================================
  // ENTREGA 4 - Autor: Máximo Gallo
  // Función que agrega eventos a todos los botones del carrito
  // (botones de cantidad y botones de eliminar)
  // ============================================
  function agregarEventosBotones() {
    // EVENTO: Botones de aumentar cantidad (+)
    document.querySelectorAll('.increase-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        let index = this.getAttribute('data-index');
        modificarCantidad(index, 1); // Aumentar en 1
      });
    });
    
    // EVENTO: Botones de disminuir cantidad (-)
    document.querySelectorAll('.decrease-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        let index = this.getAttribute('data-index');
        modificarCantidad(index, -1); // Disminuir en 1
      });
    });
    
    // EVENTO: Campos de input de cantidad (para escribir directamente)
    document.querySelectorAll('.quantity-number').forEach(function(input) {
      input.addEventListener('change', function() {
        let index = this.getAttribute('data-index');
        let newQuantity = parseInt(this.value);
        
        // Validar que sea un número válido
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 99) newQuantity = 99;
        
        establecerCantidad(index, newQuantity);
      });
    });
    
    // EVENTO: Botones de eliminar producto (×)
    document.querySelectorAll('.remove-item').forEach(function(btn) {
      btn.addEventListener('click', function() {
        let index = this.getAttribute('data-index');
        if (window.eliminarProducto) {
          window.eliminarProducto(index);
        }
      });
    });
  }
  
  // ============================================
  // ENTREGA 4 - Autor: Máximo Gallo
  // Función que modifica la cantidad de un producto
  // delta puede ser +1 (aumentar) o -1 (disminuir)
  // ============================================
  function modificarCantidad(index, delta) {
    // Obtener carrito del localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Modificar la cantidad
    cartItems[index].quantity += delta;
    
    // Validar límites (mínimo 1, máximo 99)
    if (cartItems[index].quantity < 1) {
      cartItems[index].quantity = 1;
    }
    if (cartItems[index].quantity > 99) {
      cartItems[index].quantity = 99;
    }
    
    // Guardar de nuevo en localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Recargar el carrito para mostrar cambios
    if (window.cargarCarrito) {
      window.cargarCarrito();
    }
  }
  
  // ============================================
  // ENTREGA 4 - Autor: Máximo Gallo
  // Función que establece una cantidad específica para un producto
  // ============================================
  function establecerCantidad(index, cantidad) {
    // Obtener carrito del localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Establecer la nueva cantidad
    cartItems[index].quantity = cantidad;
    
    // Guardar de nuevo en localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Recargar el carrito para mostrar cambios
    if (window.cargarCarrito) {
      window.cargarCarrito();
    }
  }
  
  // ============================================
  // EXPOSICIÓN DE FUNCIONES AL CONTEXTO GLOBAL
  // ============================================
  window.agregarEventosBotones = agregarEventosBotones;
  window.modificarCantidad = modificarCantidad;
  window.establecerCantidad = establecerCantidad;
  
  // Log de inicialización
  console.log('✓ Módulo cart-quantity.js cargado');
  
})();
