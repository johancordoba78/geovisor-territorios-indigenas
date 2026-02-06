function actualizarPanel(datos) {

  document.getElementById("panel-titulo").textContent =
    datos.TERRITORIO;

  document.getElementById("panel-subtitulo").textContent =
    datos.BENEFICIARIO;

  document.getElementById("anio-activo").textContent = anioActivo;

  const actual = datos[`RES_${anioActivo}`];
  const previo = datos[`RES_${anioActivo - 1}`];

  document.getElementById("area-actual").textContent =
    actual ? actual.toLocaleString() : "0";

  if (previo !== undefined) {
    const dif = actual - previo;
    const clase = dif >= 0 ? "positivo" : "negativo";

    document.getElementById("variacion").innerHTML =
      `<span class="${clase}">
        ${dif.toFixed(1)} ha
      </span>`;
  } else {
    document.getElementById("variacion").textContent = "No aplica";
  }

  document.getElementById("adenda").textContent = datos.ADENTA || "–";
  document.getElementById("rosa").textContent = datos.ROSA || "–";
  document.getElementById("pendiente").textContent = datos.PENDIENTE || "–";
}
