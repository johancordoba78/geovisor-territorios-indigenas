// ===============================
// TERRITORIO ACTIVO GLOBAL
// ===============================

let territorioActivo = null;
let datosActivos = null;


// ===============================
// FUNCIÓN PRINCIPAL PANEL
// ===============================

function actualizarPanel(nombre, datos) {

  territorioActivo = nombre;
  datosActivos = datos;

  document.getElementById("panel-titulo").textContent = nombre;

  actualizarDatosPanel();
}


// ===============================
// ACTUALIZA SOLO LOS DATOS (AÑO)
// ===============================

function actualizarDatosPanel() {

  const selector = document.getElementById("anio-select");
  if(!selector) return;

  const anio = selector.value;

  if (!datosActivos) {

    document.getElementById("area-actual").textContent = "–";
    document.getElementById("variacion").textContent = "–";
    document.getElementById("adenda").textContent = "–";
    document.getElementById("rosa").textContent = "–";
    document.getElementById("pendiente").textContent = "–";

    return;
  }

  const area = datosActivos.area?.[anio];
  const areaPrev = datosActivos.area?.[anio - 1];

  document.getElementById("area-actual").textContent =
    area ? Number(area).toLocaleString("es-CR") : "–";

  document.getElementById("variacion").textContent =
    (area && areaPrev)
      ? (area - areaPrev).toFixed(2) + " ha"
      : "–";

  document.getElementById("adenda").textContent = datosActivos.adenda || "–";
  document.getElementById("rosa").textContent = datosActivos.rosa || "–";
  document.getElementById("pendiente").textContent = datosActivos.pendiente || "–";
}




