function actualizarPanel(nombre, feature) {

  const datos = CREF_DATA[nombre] || null;
  const anio = parseInt(
    document.getElementById("anio-select").value,
    10
  );

  // Títulos
  document.getElementById("panel-titulo").textContent = nombre;
  document.getElementById("panel-subtitulo").textContent =
    feature?.properties?.Clasif ?? "Sin CREF ni PAFs";

  // Área
  const area = datos?.area?.[anio] ?? null;
  document.getElementById("area-actual").textContent =
    area !== null
      ? area.toLocaleString("es-CR", { minimumFractionDigits: 2 })
      : "—";

  // Variación
  const prev = datos?.area?.[anio - 1] ?? null;
  document.getElementById("variacion").textContent =
    area !== null && prev !== null
      ? `${(area - prev).toFixed(2)} ha`
      : "—";

  // Estado administrativo
  document.getElementById("adenda").textContent = datos?.adenda ?? "—";
  document.getElementById("rosa").textContent = datos?.rosa ?? "—";
  document.getElementById("pendiente").textContent = datos?.pendiente ?? "—";
}

// Cambio de año
document
  .getElementById("anio-select")
  .addEventListener("change", () => {
    if (window.territorioActivo && window.featureActivo) {
      actualizarPanel(window.territorioActivo, window.featureActivo);
    }
  });
