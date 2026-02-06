let ANIO_ACTIVO = 2024;

const anioSelect = document.getElementById("anio-select");

anioSelect.addEventListener("change", () => {
  ANIO_ACTIVO = parseInt(anioSelect.value);

  if (window.territorioActivo && window.datosActivos) {
    actualizarPanel(window.territorioActivo, window.datosActivos);
  }
});

function actualizarPanel(nombreTerritorio, datos) {

  window.territorioActivo = nombreTerritorio;
  window.datosActivos = datos;

  document.getElementById("panel-titulo").textContent = nombreTerritorio;
  document.getElementById("panel-subtitulo").textContent =
    datos?.beneficiario || "";

  const area = datos ? datos[`area_${ANIO_ACTIVO}`] : null;

  document.getElementById("area-actual").textContent =
    area ? area.toLocaleString("es-CR") : "–";

  document.getElementById("variacion").textContent =
    (ANIO_ACTIVO === 2024 && datos)
      ? `${datos.variacion_2024} ha`
      : "–";

  document.getElementById("adenda").textContent =
    datos ? datos.adenda : "–";

  document.getElementById("rosa").textContent =
    datos ? datos.rosa : "–";

  document.getElementById("pendiente").textContent =
    datos ? datos.pendiente : "–";
}
