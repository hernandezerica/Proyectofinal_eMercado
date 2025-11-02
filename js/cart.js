// ============================================
// CARRITO DE COMPRAS - eMercado
// Autor: Máximo Gallo
// ============================================
// Este archivo maneja toda la funcionalidad del carrito de compras

// ============================================
// ENTREGA 3 - Autor: Máximo Gallo
// Función para cargar productos del localStorage al cargar la página
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  
  // PASO 1: Cargar productos desde localStorage
  cargarCarrito();
  
  // PASO 2: Actualizar badge del carrito en el navbar
  actualizarBadgeCarrito();
});

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
// ENTREGA 3 - Autor: Máximo Gallo
// Función principal que carga y muestra los productos del carrito
// ============================================
function cargarCarrito() {
  // Obtener productos guardados en localStorage
  // Si no hay nada guardado, usamos un array vacío
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Referencias a elementos del DOM
  let container = document.getElementById('cart-items-container');
  let emptyMessage = document.getElementById('empty-cart-message');
  
  // VERIFICACIÓN: Si el carrito está vacío
  if (cartItems.length === 0) {
    // Mostrar mensaje de carrito vacío
    emptyMessage.style.display = 'block';
    // Ocultar el contenedor de productos
    container.innerHTML = '';
    // Actualizar resumen con valores en 0
    actualizarResumen();
    return;
  }
  
  // Si hay productos, ocultar el mensaje de carrito vacío
  emptyMessage.style.display = 'none';
  
  // Limpiar el contenedor antes de cargar
  container.innerHTML = '';
  
  // PASO 3: Recorrer cada producto y crear su HTML
  cartItems.forEach(function(producto, index) {
    // Crear el HTML del producto usando template literals
    let productoHTML = crearHTMLProducto(producto, index);
    // Agregar el producto al contenedor
    container.innerHTML += productoHTML;
  });
  
  // PASO 4: Agregar eventos a los botones después de crear el HTML
  agregarEventosBotones();
  
  // PASO 5: Calcular y mostrar el resumen (subtotal, envío, total)
  actualizarResumen();
}

// ============================================
// ENTREGA 1 - Autor: Máximo Gallo
// Función que crea el HTML de un producto para el carrito
// Incluye: imagen, nombre, descripción, cantidad y botones
// ============================================
function crearHTMLProducto(producto, index) {
  return `
    <div class="cart-item" data-index="${index}">
      <!-- Botón para eliminar producto -->
      <button class="remove-item" data-index="${index}" aria-label="Eliminar producto">×</button>
      
      <!-- Imagen del producto -->
      <img src="${producto.image}" alt="${producto.name}" class="cart-item-image">
      
      <!-- Detalles del producto -->
      <div class="cart-item-details">
        <h3 class="cart-item-name">${producto.name}</h3>
        ${producto.description ? `<p class="cart-item-description">${producto.description}</p>` : ''}
        
        <!-- ENTREGA 1 - Precio unitario y moneda -->
        <p class="cart-item-price">${producto.currency} ${producto.cost}</p>
        
        <!-- ENTREGA 4 - Subtotal calculado (costo * cantidad) -->
        <p class="cart-item-subtotal">
          Subtotal: <strong>${producto.currency} <span class="subtotal-value">${calcularSubtotal(producto.cost, producto.quantity)}</span></strong>
        </p>
        
        <!-- ENTREGA 1 - Controles para cambiar la cantidad -->
        <div class="quantity-controls">
          <button class="quantity-btn decrease-btn" data-index="${index}" aria-label="Disminuir cantidad">−</button>
          <input type="number" class="quantity-number" data-index="${index}" value="${producto.quantity}" min="1" max="99">
          <button class="quantity-btn increase-btn" data-index="${index}" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// ENTREGA 4 - Autor: Máximo Gallo
// Función que calcula el subtotal de un producto
// Multiplica el costo por la cantidad
// ============================================
function calcularSubtotal(costo, cantidad) {
  return (costo * cantidad).toFixed(2);
}

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
      eliminarProducto(index);
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
  cargarCarrito();
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
  cargarCarrito();
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
      cargarCarrito();
      
      // Actualizar badge del carrito
      actualizarBadgeCarrito();
    }
  );
}

// ============================================
// ENTREGA 4 - Autor: Máximo Gallo
// Función que actualiza el resumen de compra en tiempo real
// Calcula subtotal, envío y total
// ============================================
function actualizarResumen() {
  // Obtener productos del carrito
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Variables para los cálculos
  let subtotal = 0;
  let envio = 29.00; // Costo fijo de envío
  
  // Calcular subtotal sumando todos los productos
  cartItems.forEach(function(producto) {
    subtotal += producto.cost * producto.quantity;
  });
  
  // Si el subtotal es mayor a 500, el envío es gratis
  if (subtotal > 500) {
    envio = 0;
  }
  
  // Calcular el total
  let total = subtotal + envio;
  
  // Actualizar los valores en el HTML
  document.getElementById('subtotal-amount').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('shipping-amount').textContent = envio > 0 ? '$' + envio.toFixed(2) : 'GRATIS';
  document.getElementById('total-amount').textContent = '$' + total.toFixed(2);
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
