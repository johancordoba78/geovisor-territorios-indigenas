function actualizarPanel(props) {

  const titulo = document.getElementById("panel-titulo");
  const subtitulo = document.getElementById("panel-subtitulo");
  const area = document.getElementById("area-actual");
  const variacion = document.getElementById("variacion");
  const adenda = document.getElementById("adenda");
  const rosa = document.getElementById("rosa");
  const pendiente = document.getElementById("pendiente");

  titulo.textContent = props.TERRITORIO || "Territorio";
  subtitulo.textContent = props.CREF
    ? props.CREF.beneficiario
    : "Sin datos CREF";

  if (props.CREF) {
    area.textContent = props.CREF.area_2024.toLocaleString("es-CR");
    variacion.textContent = props.CREF.variacion + " ha";
    adenda.textContent = props.CREF.adenda;
    rosa.textContent = props.CREF.rosa;
    pendiente.textContent = props.CREF.pendiente;
  } else {
    area.textContent = "–";
    variacion.textContent = "–";
    adenda.textContent = "–";
    rosa.textContent = "–";
    pendiente.textContent = "–";
  }
}
