function actualizarPanel(props) {
  const cref = props.CREF;

  document.getElementById("panel-titulo").textContent =
    props.TERRITORIO || "Sin nombre";

  document.getElementById("panel-subtitulo").textContent =
    cref?.BENEFICIARIO || "";

  const anio = 2024;
  document.getElementById("anio-activo").textContent = anio;

  const actual = parseFloat(cref?.[`RES_${anio}`]);
  const anterior = parseFloat(cref?.[`RES_${anio - 1}`]);

  document.getElementById("area-actual").textContent =
    actual ? actual.toLocaleString("es-CR") : "–";

  if (!isNaN(actual) && !isNaN(anterior)) {
    const diff = actual - anterior;
    const v = document.getElementById("variacion");
    v.textContent = diff.toFixed(1) + " ha";
    v.className = diff >= 0 ? "positivo" : "negativo";
  } else {
    document.getElementById("variacion").textContent = "–";
  }

  document.getElementById("adenda").textContent = cref?.ADENDA || "–";
  document.getElementById("rosa").textContent = cref?.ROSA || "–";
  document.getElementById("pendiente").textContent = cref?.PENDIENTE || "–";
}
