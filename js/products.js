// Restaurado: listado con buscador en vivo, axios (con fallback), filtrado por nombre/descripción,
// soporte de categoría dinámica y navegación a detalle. Código comentado para nivel junior.
document.addEventListener("DOMContentLoaded", () => {
  // 1. Construimos la URL según la categoría guardada en localStorage (fallback 101 si falta)
  const catId = localStorage.getItem("catID") || "101";
  const URL = `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;

  // 2. Referencias a elementos del DOM: contenedor de productos y campo de búsqueda
  const contenedor = document.getElementById("product-list");
  const searchInput = document.getElementById("product-search");
  const catNameSpan = document.getElementById("category_name");

  // 3. Arrays para mantener los productos y el resultado filtrado actual
  let productos = [];
  let filtrados = [];

  // 4. Pequeña utilidad para evitar inyección de HTML (escapamos caracteres especiales)
  const escapeHtml = (str) => String(str ?? "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[m]);

  // 5. Función que navega a la página de detalle guardando el ID del producto
  const goTo = (id) => {
    try { localStorage.setItem("prodID", String(id)); } catch (e) { console.warn(e); }
    window.location = "product-info.html";
  };

  // 6. Renderiza las tarjetas de productos en el contenedor principal
  const render = (items) => {
    if (!contenedor) return;
    contenedor.innerHTML = "";
    if (!items.length) {
      contenedor.innerHTML = '<div class="text-muted" style="padding:40px 10px; text-align:center;">No hay productos que coincidan.</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    items.forEach(prod => {
      const wrapper = document.createElement("div");
      // Nueva estructura inspirada en diseño: imagen | contenido | meta (precio / vendidos)
      wrapper.innerHTML = `
        <article class="product-card" role="button" tabindex="0" aria-label="Ver producto ${escapeHtml(prod.name)}">
          <div class="pc-img">
            <img src="${escapeHtml(prod.image)}" alt="${escapeHtml(prod.name)}" loading="lazy" onerror="this.src='img/cars_index.jpg'" />
          </div>
          <div class="pc-content">
            <h3 class="pc-title">${escapeHtml(prod.name)}</h3>
            <p class="pc-desc">${escapeHtml(prod.description)}</p>
          </div>
          <div class="pc-meta">
            <div class="pc-price" aria-label="Precio ${escapeHtml(prod.currency)} ${escapeHtml(prod.cost)}">
              <span class="pc-price-inner">${escapeHtml(prod.currency)} ${escapeHtml(prod.cost)}</span>
            </div>
            <div class="pc-sold" aria-label="${escapeHtml(prod.soldCount)} vendidos">${escapeHtml(prod.soldCount)} VENDIDOS</div>
          </div>
        </article>`;
      const card = wrapper.firstElementChild;
      card.addEventListener("click", () => goTo(prod.id));
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") goTo(prod.id); });
      frag.appendChild(card);
    });
    contenedor.appendChild(frag);
  };

  // 7. Aplica el filtro según el texto del input (nombre o descripción)
  const aplicarFiltro = () => {
    const q = (searchInput?.value || "").trim().toLowerCase();
    if (!q) { filtrados = productos.slice(); render(filtrados); return; }
    filtrados = productos.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
    render(filtrados);
  };

  // 8. Debounce simple para no filtrar en cada pulsación inmediatamente
  let t;
  if (searchInput) {
    searchInput.addEventListener("input", () => { clearTimeout(t); t = setTimeout(aplicarFiltro, 120); });
  }

  // 9. Carga de datos (usa axios si está, fallback a fetch). Actualiza nombre de categoría.
  const cargar = () => {
    if (typeof showSpinner === 'function') showSpinner();
    const handle = (data) => {
      if (catNameSpan && data?.catName) catNameSpan.textContent = data.catName;
      productos = data?.products || [];
      filtrados = productos.slice();
      aplicarFiltro();
    };
    const onError = (err) => {
      console.error("Error cargando productos:", err);
      if (contenedor) contenedor.innerHTML = `<div class="alert alert-danger text-center">No se pudieron cargar los productos.</div>`;
    };
    const onFinally = () => { if (typeof hideSpinner === 'function') hideSpinner(); };

    if (typeof axios !== 'undefined') {
      axios.get(URL).then(r => handle(r.data)).catch(onError).finally(onFinally);
    } else {
      fetch(URL).then(r => r.json()).then(handle).catch(onError).finally(onFinally);
    }
  };

  // 10. Estado inicial mientras llegan los datos
  if (contenedor) contenedor.innerHTML = '<div class="text-center text-muted py-4">Cargando productos...</div>';
  cargar();

  // Entrega 3 - ericahernandez

  // Referencias a inputs y botones
const minInput = document.getElementById("rangeFilterCountMin");
const maxInput = document.getElementById("rangeFilterCountMax");
const btnFiltrar = document.getElementById("rangeFilterCount");
const btnLimpiar = document.getElementById("clearRangeFilter");
const btnAsc = document.getElementById("sortAsc");
const btnDesc = document.getElementById("sortDesc");
const btnRelev = document.getElementById("sortByCount");

// Estado de rango
let minPrice = null;
let maxPrice = null;

// Reusamos aplicarFiltro (ya existe arriba) pero extendido con precio
const aplicarFiltroExtendido = () => {
  const q = (searchInput?.value || "").trim().toLowerCase();
  filtrados = productos.filter(p => {
    const matchText =
      !q ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q));
    const matchPrice =
      (minPrice === null || p.cost >= minPrice) &&
      (maxPrice === null || p.cost <= maxPrice);
    return matchText && matchPrice;
  });
  render(filtrados);
};

// Ordenar sobre filtrados
const ordenar = (criterio) => {
  if (!filtrados.length) return;
  filtrados.sort((a, b) => {
    if (criterio === "asc") return a.cost - b.cost;
    if (criterio === "desc") return b.cost - a.cost;
    if (criterio === "relev") return b.soldCount - a.soldCount;
    return 0;
  });
  render(filtrados);
};

// Eventos de rango
btnFiltrar?.addEventListener("click", () => {
  minPrice = minInput.value ? parseInt(minInput.value) : null;
  maxPrice = maxInput.value ? parseInt(maxInput.value) : null;
  aplicarFiltroExtendido();
});

btnLimpiar?.addEventListener("click", () => {
  minInput.value = "";
  maxInput.value = "";
  minPrice = null;
  maxPrice = null;
  aplicarFiltroExtendido();
});

// Eventos de orden
btnAsc?.addEventListener("click", () => ordenar("asc"));
btnDesc?.addEventListener("click", () => ordenar("desc"));
btnRelev?.addEventListener("click", () => ordenar("relev"));

// Entrega 3 - ericahernandez

});

