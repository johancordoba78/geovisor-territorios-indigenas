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
  renderTablaAnios();
}


// ===============================
// ACTUALIZA SOLO LOS DATOS (AÑO)
// ===============================

function actualizarDatosPanel() {

  const selector = document.getElementById("anio-select");
  if (!selector) return;

  const anio = String(selector.value);

  if (!datosActivos) return;

  const areas =
    datosActivos.area ||
    datosActivos.AREA ||
    datosActivos.areas;

  if (!areas) return;

  const area = areas[anio];
  const areaPrev = areas[String(Number(anio) - 1)];

  document.getElementById("area-actual").textContent =
    area ? Number(area).toLocaleString("es-CR") : "–";

 const variacionEl = document.getElementById("variacion");

if(area && areaPrev){

  const dif = area - areaPrev;

  variacionEl.textContent = dif.toFixed(2) + " ha";

  // 🔥 KPI dinámico
  variacionEl.classList.remove("kpi-positivo","kpi-negativo","kpi-neutro");

  if(dif > 0){
    variacionEl.classList.add("kpi-positivo");
  }else if(dif < 0){
    variacionEl.classList.add("kpi-negativo");
  }else{
    variacionEl.classList.add("kpi-neutro");
  }

}else{
  variacionEl.textContent = "–";
  variacionEl.classList.remove("kpi-positivo","kpi-negativo","kpi-neutro");
}

  document.getElementById("adenda").textContent =
    datosActivos.adenda || "–";

  document.getElementById("rosa").textContent =
    datosActivos.rosa || "–";

  document.getElementById("pendiente").textContent =
    datosActivos.pendiente || "–";
}


// ===============================
// TABLA DINÁMICA POR TERRITORIO
// ===============================

function renderTablaAnios() {

  const contenedor = document.getElementById("tabla-anios");
  if (!contenedor) return;

  if (!datosActivos) {
    contenedor.innerHTML = "";
    return;
  }

  const areas =
    datosActivos.area ||
    datosActivos.AREA ||
    datosActivos.areas;

  if (!areas) {
    contenedor.innerHTML = "";
    return;
  }

  const anioSeleccionado =
    document.getElementById("anio-select")?.value;

  let html = `
    <table style="width:100%; font-size:12px; border-collapse:collapse">
      <tr style="background:#0f766e;color:#fff">
        <th style="padding:4px">Año</th>
        <th style="padding:4px">Área CREF (ha)</th>
      </tr>
  `;

  Object.keys(areas)
    .sort()
    .forEach(anio => {

      const area =
        Number(areas[anio]).toLocaleString("es-CR");

      const activo =
        (anio === anioSeleccionado)
        ? "background:#ffe600;font-weight:bold;color:#000"
        : "";

      html += `
        <tr style="${activo}">
          <td style="padding:4px;border-bottom:1px solid #ddd">${anio}</td>
          <td style="padding:4px;border-bottom:1px solid #ddd">${area}</td>
        </tr>
      `;
    });

  html += "</table>";

  contenedor.innerHTML = html;
}


// ===============================
// 🔥 EVENTO CAMBIO DE AÑO (EL BUENO)
// ===============================

const selectorAnio = document.getElementById("anio-select");

if(selectorAnio){

  selectorAnio.addEventListener("change", () => {

    console.log("🔥 CAMBIO DE AÑO DETECTADO");

    if(datosActivos){
      actualizarDatosPanel();
      renderTablaAnios();
    }

  });

}

