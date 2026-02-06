function actualizarPanel(nombreTerritorio, datos) {

  document.getElementById("panel-titulo").textContent = nombreTerritorio;
  document.getElementById("panel-subtitulo").textContent =
    datos?.beneficiario || "";

  document.getElementById("area-actual").textContent =
    datos ? datos.area_2024.toLocaleString("es-CR") : "–";

  document.getElementById("variacion").textContent =
    datos ? `${datos.variacion} ha` : "–";

  document.getElementById("adenda").textContent =
    datos ? datos.adenda : "–";

  document.getElementById("rosa").textContent =
    datos ? datos.rosa : "–";

  document.getElementById("pendiente").textContent =
    datos ? datos.pendiente : "–";
}
