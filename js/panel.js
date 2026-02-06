function actualizarPanel(datos) {
  if (!datos) return;

  document.getElementById("panel-titulo").innerText = datos.nombre || "Territorio";

  document.getElementById("area-actual").innerText =
    datos.area_2024 ? datos.area_2024.toFixed(2) : "–";

  document.getElementById("variacion").innerText =
    datos.variacion ? datos.variacion + " ha" : "–";

  document.getElementById("adenda").innerText = datos.adenda || "–";
  document.getElementById("rosa").innerText = datos.rosa || "–";
  document.getElementById("pendiente").innerText = datos.pendiente || "–";
}
