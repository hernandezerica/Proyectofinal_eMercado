// ============================================
// CART-CHECKOUT.JS - FINALIZACIÓN DE COMPRA
// ============================================
// Este módulo gestiona el proceso final de checkout
// con todas las validaciones y confirmación
// Autor: Máximo Gallo
// ============================================

(function() {
  'use strict';
  
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
    let direccionValida = false;
    if (window.validarDireccionEnvio) {
      direccionValida = window.validarDireccionEnvio();
    }
    if (!direccionValida) {
      errores.push('Complete todos los campos de dirección de envío');
    }
    
    // === VALIDACIÓN 5: Verificar forma de pago seleccionada ===
    if (!window.selectedPaymentMethod) {
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
  // ENTREGA 5 - Procesar compra exitosa
  // ============================================
  async function procesarCompraExitosa() {
    // Obtener datos para el resumen
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    cartItems.forEach(function(producto) {
      subtotal += producto.cost * producto.quantity;
    });
    
    // ============================================
    // DESAFÍATE - Enviar carrito al backend
    // ============================================
    await enviarCarritoAlBackend(cartItems);
    
    let porcentajeEnvio = 0.05;
    if (window.obtenerPorcentajeEnvio) {
      porcentajeEnvio = window.obtenerPorcentajeEnvio();
    }
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
    if (window.selectedPaymentMethod === 'card') {
      metodoPago = 'Tarjeta de crédito';
    } else if (window.selectedPaymentMethod === 'transfer') {
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
  // DESAFÍATE - Enviar carrito al backend (POST /cart)
  // ============================================
  async function enviarCarritoAlBackend(cartItems) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('No hay token de autenticación, saltando envío al backend');
      return;
    }
    
    // Transformar items al formato esperado por el backend
    const items = cartItems.map(producto => ({
      product_id: producto.id,
      count: producto.quantity
    }));
    
    try {
      const response = await fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ items })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Carrito guardado en backend:', result);
      } else {
        console.error('Error al guardar carrito:', await response.json());
      }
    } catch (error) {
      console.error('Error de conexión al enviar carrito:', error);
    }
  }
  
  // ============================================
  // EXPOSICIÓN DE FUNCIONES AL CONTEXTO GLOBAL
  // ============================================
  window.configurarBotonFinalizarCompra = configurarBotonFinalizarCompra;
  window.finalizarCompra = finalizarCompra;
  window.procesarCompraExitosa = procesarCompraExitosa;
  
  // Log de inicialización
  console.log('✓ Módulo cart-checkout.js cargado');
  
})();
