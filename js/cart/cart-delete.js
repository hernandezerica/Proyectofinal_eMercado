// ============================================
// CART-DELETE.JS - ELIMINACIÓN DE PRODUCTOS
// ============================================
// Este módulo maneja la eliminación de productos del carrito
// y el sistema de modales de confirmación reutilizable
// Autor: Máximo Gallo
// ============================================

(function() {
  'use strict';
  
  // ============================================
  // MODAL DE CONFIRMACIÓN - Autor: Máximo Gallo
  // Sistema reutilizable de modales para confirmar acciones
  // ============================================
  
  // Función que muestra el modal de confirmación
  // Parámetros:
  // - title: Título del modal
  // - message: Mensaje a mostrar
  // - type: 'warning', 'danger', 'success' (define el icono y color)
  // - onConfirm: función que se ejecuta si el usuario confirma
  function mostrarModal(title, message, type, onConfirm) {
    // Obtener elementos del modal
    const modal = document.getElementById('confirmation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalIcon = document.getElementById('modal-icon');
    const btnCancel = document.getElementById('modal-cancel');
    const btnConfirm = document.getElementById('modal-confirm');
    
    // Configurar el contenido del modal
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Configurar el icono según el tipo
    modalIcon.className = 'modal-icon ' + type;
    
    // Determinar el ícono a mostrar
    let iconHTML = '';
    if (type === 'warning') {
      iconHTML = '<i class="fa fa-exclamation-triangle"></i>';
    } else if (type === 'danger') {
      iconHTML = '<i class="fa fa-trash"></i>';
    } else if (type === 'success') {
      iconHTML = '<i class="fa fa-check"></i>';
    }
    modalIcon.innerHTML = iconHTML;
    
    // Mostrar el modal con animación
    modal.classList.add('active');
    
    // Función para cerrar el modal
    function cerrarModal() {
      modal.classList.remove('active');
      // Limpiar eventos para evitar múltiples llamadas
      btnCancel.onclick = null;
      btnConfirm.onclick = null;
      modal.onclick = null;
    }
    
    // Evento: Click en cancelar
    btnCancel.onclick = function() {
      cerrarModal();
    };
    
    // Evento: Click en confirmar
    btnConfirm.onclick = function() {
      cerrarModal();
      if (typeof onConfirm === 'function') {
        onConfirm(); // Ejecutar la función de confirmación
      }
    };
    
    // Evento: Click fuera del modal para cerrarlo
    modal.onclick = function(e) {
      if (e.target === modal) {
        cerrarModal();
      }
    };
  }
  
  // ============================================
  // ¡DESAFIATE! - Autor: Máximo Gallo
  // Función que elimina un producto del carrito
  // Usa el modal de confirmación antes de eliminar
  // ============================================
  function eliminarProducto(index) {
    // Obtener el nombre del producto para mostrarlo en el modal
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let productoNombre = cartItems[index].name;
    
    // Mostrar modal de confirmación
    mostrarModal(
      '¿Eliminar producto?',
      `¿Estás seguro de eliminar "${productoNombre}" del carrito?`,
      'danger',
      function() {
        // Esta función se ejecuta solo si el usuario confirma
        // Obtener carrito actualizado
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Eliminar el producto en la posición 'index'
        cartItems.splice(index, 1);
        
        // Guardar de nuevo en localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Recargar el carrito para mostrar cambios
        if (window.cargarCarrito) {
          window.cargarCarrito();
        }
        
        // Actualizar badge del carrito
        if (window.actualizarBadgeCarrito) {
          window.actualizarBadgeCarrito();
        }
      }
    );
  }
  
  // ============================================
  // ¡DESAFIATE! - Autor: Máximo Gallo
  // Función que actualiza el badge del carrito en el navbar
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
  // EXPOSICIÓN DE FUNCIONES AL CONTEXTO GLOBAL
  // ============================================
  window.mostrarModal = mostrarModal;
  window.eliminarProducto = eliminarProducto;
  window.actualizarBadgeCarrito = actualizarBadgeCarrito;
  
  // Log de inicialización
  console.log('✓ Módulo cart-delete.js cargado');
  
})();
