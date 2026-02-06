// ===============================
// PANEL LATERAL – ACTUALIZACIÓN
// ===============================

function actualizarPanel(nombreTerritorio, datos) {

  // TÍTULO
  const titulo = document.getElementById("panel-titulo");
  titulo.textContent = nombreTerritorio || "Seleccione un territorio";

  // SUBTÍTULO / BENEFICIARIO
  const subtitulo = document.getElementById("panel-subtitulo");
  subtitulo.textContent = datos?.beneficiario || "Sin datos CREF";

  // AÑO SELECCIONADO
  const selectAnio = document.getElementById("anio-select");
  const anio = selectAnio ? selectAnio.value : "2024";

  // MOSTRAR AÑO
  const anioActivo = document.getElementById("anio-activo");
  if (anioActivo) anioActivo.textContent = anio;

  // ===============================
  // ÁREA EFECTIVA
  // ===============================

  const areaDiv = document.getElementById("area-actual");

  let area = null;
  if (datos) {
    if (anio === "2024") area = datos.area_2024;
    if (anio === "2023") area = datos.area_2023;
  }

  areaDiv.textContent = area
    ? area.toLocaleString("es-CR", { minimumFractionDigits: 2 })
    : "—";

  // ===============================
  // VARIACIÓN INTERANUAL
  // ===============================

  const variacionDiv = document.getElementById("variacion");

  if (datos && datos.variacion !== null) {
    const signo = datos.variacion > 0 ? "+" : "";
    variacionDiv.textContent = `${signo}${datos.variacion.toFixed(2)} ha`;
    variacionDiv.className = datos.variacion > 0 ? "positivo" : "negativo";
  } else {
    variacionDiv.textContent = "—";
    variacionDiv.className = "";
  }

  // ===============================
  // ESTADO ADMINISTRATIVO
  // ===============================

  document.getElementById("adenda").textContent =
    datos?.adenda ?? "—";

  document.getElementById("rosa").textContent =
    datos?.rosa ?? "—";

  document.getElementById("pendiente").textContent =
    datos?.pendiente ?? "—";
}

// ===============================
// CAMBIO DE AÑO
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const selectAnio = document.getElementById("anio-select");

  if (selectAnio) {
    selectAnio.addEventListener("change", () => {
      if (window.territorioActivo && window.datosActivos) {
        actualizarPanel(window.territorioActivo, window.datosActivos);
      }
    });
  }
});
