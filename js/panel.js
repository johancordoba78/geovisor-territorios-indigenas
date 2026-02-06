// ===============================
// PANEL LATERAL – LÓGICA PRINCIPAL
// ===============================

function actualizarPanel(nombreTerritorio, feature) {

  // -------------------------------
  // ELEMENTOS DEL PANEL
  // -------------------------------
  const titulo = document.getElementById("panel-titulo");
  const subtitulo = document.getElementById("panel-subtitulo");
  const areaDiv = document.getElementById("area-actual");
  const variacionDiv = document.getElementById("variacion");
  const adendaDiv = document.getElementById("adenda");
  const rosaDiv = document.getElementById("rosa");
  const pendienteDiv = document.getElementById("pendiente");

  const selectAnio = document.getElementById("anio-select");
  const anio = parseInt(selectAnio.value, 10);

  // -------------------------------
  // TÍTULO Y CLASIFICACIÓN
  // -------------------------------
  titulo.textContent = nombreTerritorio || "Seleccione un territorio";
  subtitulo.textContent =
    feature?.properties?.Clasif || "Sin CREF ni PAFS";

  // -------------------------------
  // DATOS CREF (SERIE TEMPORAL)
  // -------------------------------
  const datos = CREF_DATA[nombreTerritorio] || null;
  const areaActual = datos?.area?.[anio] ?? null;
  const areaAnterior = datos?.area?.[anio - 1] ?? null;

  // -------------------------------
  // ÁREA EFECTIVA BAJO CREF
  // -------------------------------
  areaDiv.textContent = areaActual !== null
    ? areaActual.toLocaleString("es-CR", { minimumFractionDigits: 2 })
    : "—";

  // -------------------------------
  // VARIACIÓN INTERANUAL
  // -------------------------------
  if (areaActual !== null && areaAnterior !== null) {
    const diff = areaActual - areaAnterior;
    const signo = diff > 0 ? "+" : "";
    variacionDiv.textContent = `${signo}${diff.toFixed(2)} ha`;
    variacionDiv.className = diff >= 0 ? "positivo" : "negativo";
  } else {
    variacionDiv.textContent = "—";
    variacionDiv.className = "";
  }

  // -------------------------------
  // ESTADO ADMINISTRATIVO
  // (si no existe, se muestra guion)
  // -------------------------------
  adendaDiv.textContent = datos?.adenda ?? "—";
  rosaDiv.textContent = datos?.rosa ?? "—";
  pendienteDiv.textContent = datos?.pendiente ?? "—";
}

// ===============================
// CAMBIO DE AÑO (REACTIVO)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const selectAnio = document.getElementById("anio-select");

  if (selectAnio) {
    selectAnio.addEventListener("change", () => {
      if (window.territorioActivo && window.featureActivo) {
        actualizarPanel(
          window.territorioActivo,
          window.featureActivo
        );
      }
    });
  }
});
