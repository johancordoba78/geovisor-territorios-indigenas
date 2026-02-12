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
  renderTablaAnios(); // 🔥 NUEVO
}


// ===============================
// ACTUALIZA SOLO LOS DATOS (AÑO)
// ===============================

function actualizarDatosPanel() {

  const selector = document.getElementById("anio-select");
  if (!selector) return;

  const anio = String(selector.value);

  if (!datosActivos) {

    document.getElementById("area-actual").textContent = "–";
    document.getElementById("variacion").textContent = "–";
    document.getElementById("adenda").textContent = "–";
    document.getElementById("rosa").textContent = "–";
    document.getElementById("pendiente").textContent = "–";

    return;
  }

  const area = datosActivos.area?.[anio];
  const areaPrev = datosActivos.area?.[String(Number(anio) - 1)];

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


// ===============================
// 🔥 TABLA DINÁMICA POR TERRITORIO (NUEVO)
// ===============================

function renderTablaAnios() {

  const contenedor = document.getElementById("tabla-anios");
  if (!contenedor) return;

  if (!datosActivos || !datosActivos.area) {
    contenedor.innerHTML = "";
    return;
  }

  const anioSeleccionado = document.getElementById("anio-select")?.value;

  let html = `
    <table style="width:100%; font-size:12px; border-collapse:collapse">
      <tr style="background:#222;color:#fff">
        <th style="padding:4px">Año</th>
        <th style="padding:4px">Área CREF (ha)</th>
      </tr>
  `;

  Object.keys(datosActivos.area)
    .sort()
    .forEach(anio => {

      const area = Number(datosActivos.area[anio]).toLocaleString("es-CR");

      const activo = (anio === anioSeleccionado)
        ? "background:#ffe600;font-weight:bold;color:#000"
        : "";

      html += `
        <tr style="${activo}">
          <td style="padding:4px; border-bottom:1px solid #ddd">${anio}</td>
          <td style="padding:4px; border-bottom:1px solid #ddd">${area}</td>
        </tr>
      `;
    });

  html += "</table>";

  contenedor.innerHTML = html;
}


// ===============================
// EVENTO CAMBIO DE AÑO
// ===============================

const selectorAnio = document.getElementById("anio-select");

if(selectorAnio){
  selectorAnio.addEventListener("change", () => {

    actualizarDatosPanel();
    renderTablaAnios(); // 🔥 resalta año automáticamente

  });
}


