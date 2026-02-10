function actualizarPanel(nombre, datos) {
  document.getElementById("panel-titulo").textContent = nombre;
  const anio = document.getElementById("anio-select").value;
  if (!datos) return;
  const area = datos.area[anio];
  const areaPrev = datos.area[anio - 1];
  document.getElementById("area-actual").textContent =
    area ? area.toLocaleString("es-CR") : "–";
  document.getElementById("variacion").textContent =
    areaPrev ? (area - areaPrev).toFixed(2) + " ha" : "–";
  document.getElementById("adenda").textContent = datos.adenda;
  document.getElementById("rosa").textContent = datos.rosa;
  document.getElementById("pendiente").textContent = datos.pendiente;
}
