// ============================================
// CARRITO DE COMPRAS - eMercado
// Autor: Máximo Gallo
// ENTREGA 5 - Versión completa con checkout
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
let selectedPaymentMethod = null; // 'card' o 'transfer'
let paymentData = {}; // Almacena los datos del método de pago seleccionado

// ============================================
// INICIALIZACIÓN - Al cargar la página
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  // PASO 1: Cargar productos desde localStorage
  cargarCarrito();
  
  // PASO 2: Actualizar badge del carrito en el navbar
  actualizarBadgeCarrito();
  
  // PASO 3: Configurar eventos de tipo de envío
  configurarEventosEnvio();
  
  // PASO 4: Configurar eventos de forma de pago
  configurarEventosPago();
  
  // PASO 5: Configurar evento del botón finalizar compra
  configurarBotonFinalizarCompra();
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
// ENTREGA 5 - Función mejorada que actualiza el resumen de compra
// Calcula: subtotal, envío (basado en porcentaje seleccionado) y total
// ============================================
function actualizarResumen() {
  // Obtener productos del carrito
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Variables para los cálculos
  let subtotal = 0;
  
  // Calcular subtotal sumando todos los productos
  cartItems.forEach(function(producto) {
    subtotal += producto.cost * producto.quantity;
  });
  
  // Obtener el porcentaje de envío seleccionado (default 5% = 0.05)
  let shippingPercentage = obtenerPorcentajeEnvio();
  
  // Calcular costo de envío
  let costoEnvio = subtotal * shippingPercentage;
  
  // Calcular el total
  let total = subtotal + costoEnvio;
  
  // Actualizar los valores en el HTML
  document.getElementById('subtotal-amount').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('shipping-amount').textContent = '$' + costoEnvio.toFixed(2);
  document.getElementById('total-amount').textContent = '$' + total.toFixed(2);
  
  // Actualizar el texto del porcentaje
  let percentageText = (shippingPercentage * 100) + '%';
  document.getElementById('shipping-percentage').textContent = '(' + percentageText + ')';
}

// ============================================
// ENTREGA 5 - Función que obtiene el porcentaje de envío seleccionado
// ============================================
function obtenerPorcentajeEnvio() {
  let radioSeleccionado = document.querySelector('input[name="shipping-type"]:checked');
  if (radioSeleccionado) {
    return parseFloat(radioSeleccionado.value);
  }
  return 0.05; // Default: 5%
}

// ============================================
// ENTREGA 5 - Configurar eventos de tipo de envío
// ============================================
function configurarEventosEnvio() {
  let radios = document.querySelectorAll('input[name="shipping-type"]');
  radios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      // Ocultar error si estaba visible
      document.getElementById('shipping-error').style.display = 'none';
      // Actualizar resumen cuando cambia el tipo de envío
      actualizarResumen();
    });
  });
}

// ============================================
// ENTREGA 5 - Configurar eventos de forma de pago
// ============================================
function configurarEventosPago() {
  // Botón de tarjeta de crédito
  document.getElementById('payment-card-btn').addEventListener('click', function() {
    abrirModalPago('card');
  });
  
  // Botón de transferencia bancaria
  document.getElementById('payment-transfer-btn').addEventListener('click', function() {
    abrirModalPago('transfer');
  });
  
  // === MODAL TARJETA DE CRÉDITO ===
  
  // Cerrar modal (X)
  document.getElementById('close-card-modal').addEventListener('click', function() {
    cerrarModalPago('card');
  });
  
  // Cancelar modal
  document.getElementById('cancel-card-modal').addEventListener('click', function() {
    cerrarModalPago('card');
  });
  
  // Guardar datos de tarjeta
  document.getElementById('save-card-payment').addEventListener('click', function() {
    guardarDatosPago('card');
  });
  
  // Formateo automático del número de tarjeta
  document.getElementById('card-number').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
  });
  
  // Formateo automático de fecha de vencimiento
  document.getElementById('card-expiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
  });
  
  // Solo números en CVV
  document.getElementById('card-cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
  });
  
  // === MODAL TRANSFERENCIA BANCARIA ===
  
  // Cerrar modal (X)
  document.getElementById('close-transfer-modal').addEventListener('click', function() {
    cerrarModalPago('transfer');
  });
  
  // Cancelar modal
  document.getElementById('cancel-transfer-modal').addEventListener('click', function() {
    cerrarModalPago('transfer');
  });
  
  // Guardar datos de transferencia
  document.getElementById('save-transfer-payment').addEventListener('click', function() {
    guardarDatosPago('transfer');
  });
  
  // Cerrar modal al hacer click fuera
  document.getElementById('payment-card-modal').addEventListener('click', function(e) {
    if (e.target === this) {
      cerrarModalPago('card');
    }
  });
  
  document.getElementById('payment-transfer-modal').addEventListener('click', function(e) {
    if (e.target === this) {
      cerrarModalPago('transfer');
    }
  });
}

// ============================================
// ENTREGA 5 - Abrir modal de pago
// ============================================
function abrirModalPago(tipo) {
  if (tipo === 'card') {
    document.getElementById('payment-card-modal').classList.add('active');
  } else if (tipo === 'transfer') {
    document.getElementById('payment-transfer-modal').classList.add('active');
  }
}

// ============================================
// ENTREGA 5 - Cerrar modal de pago
// ============================================
function cerrarModalPago(tipo) {
  if (tipo === 'card') {
    document.getElementById('payment-card-modal').classList.remove('active');
    // Limpiar errores
    limpiarErroresFormulario('card-payment-form');
  } else if (tipo === 'transfer') {
    document.getElementById('payment-transfer-modal').classList.remove('active');
    // Limpiar errores
    limpiarErroresFormulario('transfer-payment-form');
  }
}

// ============================================
// ENTREGA 5 - Guardar datos del método de pago
// ============================================
function guardarDatosPago(tipo) {
  let valido = false;
  
  if (tipo === 'card') {
    valido = validarFormularioTarjeta();
    if (valido) {
      // Guardar datos (en la práctica, esto sería encriptado)
      paymentData = {
        tipo: 'card',
        numero: document.getElementById('card-number').value,
        vencimiento: document.getElementById('card-expiry').value,
        cvv: document.getElementById('card-cvv').value,
        titular: document.getElementById('card-name').value
      };
      selectedPaymentMethod = 'card';
      
      // Marcar botón como activo
      marcarMetodoPagoActivo('payment-card-btn');
      
      // Cerrar modal
      cerrarModalPago('card');
      
      // Ocultar error general si estaba visible
      document.getElementById('payment-error').style.display = 'none';
    }
  } else if (tipo === 'transfer') {
    valido = validarFormularioTransferencia();
    if (valido) {
      // Guardar datos
      paymentData = {
        tipo: 'transfer',
        banco: document.getElementById('bank-name').value,
        cuenta: document.getElementById('account-number').value,
        titular: document.getElementById('account-holder').value
      };
      selectedPaymentMethod = 'transfer';
      
      // Marcar botón como activo
      marcarMetodoPagoActivo('payment-transfer-btn');
      
      // Cerrar modal
      cerrarModalPago('transfer');
      
      // Ocultar error general si estaba visible
      document.getElementById('payment-error').style.display = 'none';
    }
  }
}

// ============================================
// ENTREGA 5 - Marcar método de pago como activo
// ============================================
function marcarMetodoPagoActivo(botonId) {
  // Quitar clase active de todos los botones
  document.querySelectorAll('.payment-btn').forEach(function(btn) {
    btn.classList.remove('active');
    btn.querySelector('.payment-check').style.display = 'none';
  });
  
  // Agregar clase active al botón seleccionado
  let boton = document.getElementById(botonId);
  boton.classList.add('active');
  boton.querySelector('.payment-check').style.display = 'block';
}

// ============================================
// ENTREGA 5 - Validar formulario de tarjeta
// ============================================
function validarFormularioTarjeta() {
  let valido = true;
  
  // Limpiar errores previos
  limpiarErroresFormulario('card-payment-form');
  
  // Validar número de tarjeta
  let numero = document.getElementById('card-number').value.replace(/\s/g, '');
  if (numero.length < 13 || numero.length > 19) {
    mostrarError('card-number', 'Número de tarjeta inválido');
    valido = false;
  }
  
  // Validar vencimiento
  let vencimiento = document.getElementById('card-expiry').value;
  if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
    mostrarError('card-expiry', 'Formato: MM/AA');
    valido = false;
  } else {
    // Validar que la fecha no esté vencida
    let [mes, año] = vencimiento.split('/').map(Number);
    let fechaActual = new Date();
    let mesActual = fechaActual.getMonth() + 1;
    let añoActual = fechaActual.getFullYear() % 100;
    
    if (año < añoActual || (año === añoActual && mes < mesActual)) {
      mostrarError('card-expiry', 'Tarjeta vencida');
      valido = false;
    }
  }
  
  // Validar CVV
  let cvv = document.getElementById('card-cvv').value;
  if (cvv.length < 3 || cvv.length > 4) {
    mostrarError('card-cvv', 'CVV inválido');
    valido = false;
  }
  
  // Validar nombre
  let nombre = document.getElementById('card-name').value.trim();
  if (nombre.length < 3) {
    mostrarError('card-name', 'Ingrese el nombre del titular');
    valido = false;
  }
  
  return valido;
}

// ============================================
// ENTREGA 5 - Validar formulario de transferencia
// ============================================
function validarFormularioTransferencia() {
  let valido = true;
  
  // Limpiar errores previos
  limpiarErroresFormulario('transfer-payment-form');
  
  // Validar banco
  let banco = document.getElementById('bank-name').value;
  if (!banco) {
    mostrarError('bank-name', 'Seleccione un banco');
    valido = false;
  }
  
  // Validar número de cuenta
  let cuenta = document.getElementById('account-number').value.trim();
  if (cuenta.length < 6) {
    mostrarError('account-number', 'Número de cuenta inválido');
    valido = false;
  }
  
  // Validar titular
  let titular = document.getElementById('account-holder').value.trim();
  if (titular.length < 3) {
    mostrarError('account-holder', 'Ingrese el nombre del titular');
    valido = false;
  }
  
  return valido;
}

// ============================================
// ENTREGA 5 - Mostrar error en campo específico
// ============================================
function mostrarError(campoId, mensaje) {
  let campo = document.getElementById(campoId);
  let errorDiv = document.getElementById(campoId + '-error');
  
  campo.classList.add('error');
  campo.classList.remove('success');
  
  if (errorDiv) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'flex';
  }
}

// ============================================
// ENTREGA 5 - Limpiar errores de un formulario
// ============================================
function limpiarErroresFormulario(formId) {
  let form = document.getElementById(formId);
  if (!form) return;
  
  // Quitar clases de error de todos los inputs
  form.querySelectorAll('.form-input').forEach(function(input) {
    input.classList.remove('error');
    input.classList.remove('success');
  });
  
  // Ocultar todos los mensajes de error
  form.querySelectorAll('.form-error').forEach(function(errorDiv) {
    errorDiv.style.display = 'none';
  });
}

// ============================================
// ENTREGA 5 - Configurar botón Finalizar Compra
// ============================================
function configurarBotonFinalizarCompra() {
  document.getElementById('finalize-purchase-btn').addEventListener('click', function() {
    finalizarCompra();
  });
}

// ============================================
// ENTREGA 5 - Función principal para finalizar la compra
// Realiza todas las validaciones y muestra modal de éxito
// ============================================
function finalizarCompra() {
  // Array para almacenar errores
  let errores = [];
  
  // === VALIDACIÓN 1: Verificar que hay productos en el carrito ===
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  if (cartItems.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  
  // === VALIDACIÓN 2: Verificar cantidades de productos ===
  let cantidadesValidas = true;
  cartItems.forEach(function(producto) {
    if (!producto.quantity || producto.quantity <= 0) {
      cantidadesValidas = false;
    }
  });
  
  if (!cantidadesValidas) {
    errores.push('Las cantidades de los productos deben ser mayores a 0');
  }
  
  // === VALIDACIÓN 3: Verificar tipo de envío seleccionado ===
  let tipoEnvioSeleccionado = document.querySelector('input[name="shipping-type"]:checked');
  if (!tipoEnvioSeleccionado) {
    errores.push('Debe seleccionar un tipo de envío');
    document.getElementById('shipping-error').style.display = 'flex';
    // Scroll al error
    document.getElementById('shipping-error').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // === VALIDACIÓN 4: Verificar dirección de envío ===
  let direccionValida = validarDireccionEnvio();
  if (!direccionValida) {
    errores.push('Complete todos los campos de dirección de envío');
  }
  
  // === VALIDACIÓN 5: Verificar forma de pago seleccionada ===
  if (!selectedPaymentMethod) {
    errores.push('Debe seleccionar y completar una forma de pago');
    document.getElementById('payment-error').style.display = 'flex';
    // Scroll al error
    document.getElementById('payment-error').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // === SI HAY ERRORES: Mostrar y detener ===
  if (errores.length > 0) {
    // Mostrar primer error
    alert('Por favor corrija los siguientes errores:\n\n• ' + errores.join('\n• '));
    return;
  }
  
  // === SI TODO ES VÁLIDO: Procesar compra ===
  procesarCompraExitosa();
}

// ============================================
// ENTREGA 5 - Validar dirección de envío
// ============================================
function validarDireccionEnvio() {
  let valido = true;
  
  // Campos requeridos
  let campos = [
    { id: 'department', nombre: 'Departamento' },
    { id: 'locality', nombre: 'Localidad' },
    { id: 'street', nombre: 'Calle' },
    { id: 'number', nombre: 'Número' },
    { id: 'corner', nombre: 'Esquina' }
  ];
  
  // Limpiar errores previos
  campos.forEach(function(campo) {
    let input = document.getElementById(campo.id);
    let errorDiv = document.getElementById(campo.id + '-error');
    input.classList.remove('error');
    input.classList.remove('success');
    if (errorDiv) errorDiv.style.display = 'none';
  });
  
  // Validar cada campo
  campos.forEach(function(campo) {
    let input = document.getElementById(campo.id);
    let valor = input.value.trim();
    
    if (!valor) {
      mostrarError(campo.id, 'Este campo es requerido');
      valido = false;
    } else {
      // Marcar como válido
      input.classList.add('success');
      input.classList.remove('error');
    }
  });
  
  return valido;
}

// ============================================
// ENTREGA 5 - Procesar compra exitosa
// ============================================
function procesarCompraExitosa() {
  // Obtener datos para el resumen
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  let subtotal = 0;
  
  cartItems.forEach(function(producto) {
    subtotal += producto.cost * producto.quantity;
  });
  
  let porcentajeEnvio = obtenerPorcentajeEnvio();
  let costoEnvio = subtotal * porcentajeEnvio;
  let total = subtotal + costoEnvio;
  
  // Obtener tipo de envío
  let tipoEnvio = document.querySelector('input[name="shipping-type"]:checked');
  let tipoEnvioNombre = '';
  if (tipoEnvio) {
    let label = document.querySelector(`label[for="${tipoEnvio.id}"]`);
    tipoEnvioNombre = label.querySelector('.shipping-name').textContent;
  }
  
  // Obtener método de pago
  let metodoPago = '';
  if (selectedPaymentMethod === 'card') {
    metodoPago = 'Tarjeta de crédito';
  } else if (selectedPaymentMethod === 'transfer') {
    metodoPago = 'Transferencia bancaria';
  }
  
  // Crear resumen HTML
  let resumenHTML = `
    <div style="text-align: left;">
      <p><strong>Productos:</strong> ${cartItems.length} artículo(s)</p>
      <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
      <p><strong>Envío ${tipoEnvioNombre}:</strong> $${costoEnvio.toFixed(2)}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <hr style="margin: 10px 0;">
      <p><strong>Método de pago:</strong> ${metodoPago}</p>
      <p><strong>Dirección:</strong> ${document.getElementById('street').value} ${document.getElementById('number').value}, ${document.getElementById('locality').value}</p>
    </div>
  `;
  
  // Mostrar modal de éxito
  document.getElementById('purchase-summary').innerHTML = resumenHTML;
  document.getElementById('success-modal').classList.add('active');
  
  // Configurar botón de cerrar
  document.getElementById('close-success-modal').onclick = function() {
    document.getElementById('success-modal').classList.remove('active');
    
    // Limpiar carrito
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Recargar página para mostrar carrito vacío
    window.location.reload();
  };
  
  // Cerrar modal al hacer click fuera
  document.getElementById('success-modal').onclick = function(e) {
    if (e.target === this) {
      this.classList.remove('active');
      localStorage.setItem('cart', JSON.stringify([]));
      window.location.reload();
    }
  };
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
