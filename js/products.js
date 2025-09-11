document.addEventListener("DOMContentLoaded", () => {
  const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
  // Contenedor donde insertaremos las tarjetas (nuevo id en el HTML)
  const contenedor = document.getElementById("product-list");
  const searchInput = document.getElementById("product-search");

  let productos = [];
  let filtrados = [];

  const escapeHtml = (str) => String(str ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));

  // Render de tarjetas con nuevo layout y clases reutilizando estilos globales.
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
      // Usamos solo la card (sin grid bootstrap) para un ancho fluido y max-width controlado por .product-list
      wrapper.innerHTML = `
        <div class="card h-100 shadow-sm" role="button" tabindex="0" aria-label="Ver producto ${escapeHtml(prod.name)}">
          <img src="${prod.image}" class="card-img-top" alt="${escapeHtml(prod.name)}">
          <div class="card-body">
            <h5 class="card-title">${escapeHtml(prod.name)}</h5>
            <p class="card-text">${escapeHtml(prod.description)}</p>
          </div>
          <div class="card-footer">
            <span>${prod.currency} ${prod.cost}</span>
            <small>${prod.soldCount} VENDIDOS</small>
          </div>
        </div>`;
      const card = wrapper.firstElementChild;
      card.addEventListener("click", () => goTo(prod.id));
      card.addEventListener("keypress", (e) => { if (e.key === "Enter") goTo(prod.id); });
      frag.appendChild(wrapper.firstElementChild);
    });
    contenedor.appendChild(frag);
  };

  const goTo = (id) => {
    try { localStorage.setItem("prodID", String(id)); } catch(e) { console.warn(e); }
    window.location = "product-info.html";
  };

  const aplicarFiltro = () => {
    const q = (searchInput?.value || "").trim().toLowerCase();
    if (!q) { filtrados = productos.slice(); render(filtrados); return; }
    filtrados = productos.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
    render(filtrados);
  };

  // Debounce input
  let t;
  if (searchInput) {
    searchInput.addEventListener("input", () => { clearTimeout(t); t = setTimeout(aplicarFiltro, 120); });
  }

  // Cargar con axios si está disponible; si no, usar fetch como fallback
  const cargar = () => {
    if (typeof showSpinner === 'function') showSpinner();
    const handle = (data) => {
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

  // Estado inicial mientras carga
  if (contenedor) contenedor.innerHTML = '<div class="text-center text-muted py-4">Cargando productos...</div>';
  cargar();
});
