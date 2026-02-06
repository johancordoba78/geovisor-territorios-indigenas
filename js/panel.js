function actualizarPanel(nombre) {
  const datos = CREF_DATA[nombre] || null;
  const anio = document.getElementById("anio-select").value;

  document.getElementById("panel-titulo").innerText = nombre;

  if (!datos || !datos.area[anio]) {
    document.getElementById("panel-subtitulo").innerText = "Sin datos CREF";
    document.getElementById("area-actual").innerText = "–";
    document.getElementById("variacion").innerText = "–";
    document.getElementById("adenda").innerText = "–";
    document.getElementById("rosa").innerText = "–";
    document.getElementById("pendiente").innerText = "–";
    return;
  }

  const areaActual = datos.area[anio];
  const areaPrev = datos.area[anio - 1];

  document.getElementById("panel-subtitulo").innerText = "";
  document.getElementById("area-actual").innerText =
    areaActual.toLocaleString("es-CR", { maximumFractionDigits: 2 });

  document.getElementById("variacion").innerText =
    areaPrev ? (areaActual - areaPrev).toFixed(2) + " ha" : "–";

  document.getElementById("adenda").innerText = datos.adenda;
  document.getElementById("rosa").innerText = datos.rosa;
  document.getElementById("pendiente").innerText = datos.pendiente;
}

// Cambio de año
document.getElementById("anio-select").addEventListener("change", () => {
  const titulo = document.getElementById("panel-titulo").innerText;
  if (titulo !== "Seleccione un territorio") {
    actualizarPanel(titulo);
  }
});
