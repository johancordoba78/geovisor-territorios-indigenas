function actualizarPanel(props) {
  const nombre = props.TERRITORIO;

  document.getElementById("panel-titulo").innerText = nombre;

  if (!props.CREF) {
    document.getElementById("area-actual").innerText = "–";
    document.getElementById("variacion").innerText = "–";
    document.getElementById("adenda").innerText = "–";
    document.getElementById("rosa").innerText = "–";
    document.getElementById("pendiente").innerText = "–";
    return;
  }

  document.getElementById("area-actual").innerText =
    props.CREF.area_2024.toLocaleString("es-CR");

  document.getElementById("variacion").innerText =
    props.CREF.variacion + " ha";

  document.getElementById("adenda").innerText = props.CREF.adenda;
  document.getElementById("rosa").innerText = props.CREF.rosa;
  document.getElementById("pendiente").innerText = props.CREF.pendiente;
}
