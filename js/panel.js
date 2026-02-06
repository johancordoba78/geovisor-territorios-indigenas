function actualizarPanel(nombre, datos) {
  document.getElementById("panel-titulo").textContent = nombre;

  const anio = document.getElementById("anio-select").value;

  if (!datos) {
    document.getElementById("area-actual").textContent = "–";
    document.getElementById("variacion").textContent = "–";
    document.getElementById("adenda").textContent = "–";
    document.getElementById("rosa").textContent = "–";
    document.getElementById("pendiente").textContent = "–";
    return;
  }

  const area = datos.area[anio] ?? "–";
  const areaPrev = datos.area[anio - 1];

  document.getElementById("area-actual").textContent =
    typeof area === "number" ? area.toLocaleString("es-CR") : "–";

  document.getElementById("variacion").textContent =
    areaPrev ? (area - areaPrev).toFixed(2) + " ha" : "–";

  document.getElementById("adenda").textContent = datos.adenda;
  document.getElementById("rosa").textContent = datos.rosa;
  document.getElementById("pendiente").textContent = datos.pendiente;
}
