function actualizarPanel(nombre, datos) {

  // TÍTULO
  document.getElementById("panel-titulo").innerText = nombre;

  // Subtítulo opcional
  document.getElementById("panel-subtitulo").innerText =
    datos ? "Con datos CREF" : "Sin datos CREF";

  // SI NO HAY DATOS CREF
  if (!datos) {
    document.getElementById("area-actual").innerText = "–";
    document.getElementById("variacion").innerText = "–";
    document.getElementById("adenda").innerText = "–";
    document.getElementById("rosa").innerText = "–";
    document.getElementById("pendiente").innerText = "–";
    return;
  }

  // SI SÍ HAY DATOS
  document.getElementById("area-actual").innerText =
    datos.area_2024.toLocaleString("es-CR");

  document.getElementById("variacion").innerText =
    (datos.variacion ?? 0) + " ha";

  document.getElementById("adenda").innerText = datos.adenda;
  document.getElementById("rosa").innerText = datos.rosa;
  document.getElementById("pendiente").innerText = datos.pendiente;
}
