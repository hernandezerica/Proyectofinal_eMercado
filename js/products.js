document.addEventListener("DOMContentLoaded", function () {
  const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
  const contenedor = document.querySelector("main.container");

  // Limpio lo que había (el cartel rojo de "Funcionalidad en desarrollo")
  contenedor.innerHTML = "";

  fetch(URL)
    .then(response => response.json())
    .then(data => {
      const productos = data.products;

      // Creo un contenedor con clases de Bootstrap
      let row = document.createElement("div");
      row.classList.add("row");

      productos.forEach(prod => {
        let col = document.createElement("div");
        col.classList.add("col-md-4", "mb-4");

        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${prod.image}" class="card-img-top" alt="${prod.name}">
            <div class="card-body">
              <h5 class="card-title">${prod.name}</h5>
              <p class="card-text">${prod.description}</p>
            </div>
            <div class="card-footer">
              <small class="text-muted">Vendidos: ${prod.soldCount}</small><br>
              <span class="fw-bold text-success">${prod.currency} ${prod.cost}</span>
            </div>
          </div>
        `;

        row.appendChild(col);
      });

      contenedor.appendChild(row);
    })
    .catch(error => {
      console.error("Error cargando productos:", error);
      contenedor.innerHTML = `<div class="alert alert-danger text-center">No se pudieron cargar los productos.</div>`;
    });
});
