function actualizarPanel(data) {
  document.getElementById("panel-titulo").innerText = data.TERRITORIO || "—";
  document.getElementById("panel-subtitulo").innerText = data.beneficiario || "";

  document.getElementById("area-actual").innerText =
    data.area_2024 ? data.area_2024.toLocaleString("es-CR") : "—";

  document.getElementById("variacion").innerText =
    data.variacion ? data.variacion + " ha" : "—";

  document.getElementById("adenda").innerText = data.adenda || "—";
  document.getElementById("rosa").innerText = data.rosa || "—";
  document.getElementById("pendiente").innerText = data.pendiente || "—";
}
