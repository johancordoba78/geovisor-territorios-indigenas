// ===============================
// 🔥 ESTADO GLOBAL DE LA APP
// ===============================

window.APP_STATE = {
  territorio: null,
  datos: null
};


// ===============================
// MAPA BASE BLANCO
// ===============================

const baseMaps = {
  "Blanco": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    { attribution: "© CARTO" }
  )
};

const map = L.map("map", {
  center: [9.75, -84.2], // Costa Rica centrado
  zoom: 9,              // 🔥 más cercano
  layers: [baseMaps["Blanco"]]
});


L.control.layers(baseMaps).addTo(map);


// ===============================
// CARGAR JSON DEL EXCEL
// ===============================

fetch("data/cref_por_territorio.json")
  .then(r => r.json())
  .then(data => {

    console.log("✔ JSON CREF cargado");
    CREF_DATA = data;

    cargarTerritorios();

  })
  .catch(err => console.error("Error JSON:", err));


// ===============================
// ESTILO SEGÚN CLASIFICACIÓN
// ===============================

function estiloTerritorio(feature) {

  const clasif = (feature.properties.CLASIF || "")
    .trim()
    .toUpperCase();

  let fillColor = "#ff6600";

  if (clasif === "CREF Y PAFTS") fillColor = "#6a0dad";
  if (clasif === "SOLO PAFTS") fillColor = "#0047ff";

  return {
    color: "#ffffff",
    weight: 2.5,
    fillColor,
    fillOpacity: 0.85
  };
}


// ===============================
// CARGAR TERRITORIOS GEOJSON
// ===============================

function cargarTerritorios() {

  fetch("data/territorios_indigenas.geojson")
    .then(r => r.json())
    .then(data => {

      const capa = L.geoJSON(data, {

        style: estiloTerritorio,

        onEachFeature: (feature, layer) => {

          const nombre = feature.properties.TERRITORIO
            ?.trim()
            .toUpperCase();

          const clasif = feature.properties.CLASIF;

          layer.bindTooltip(
            `<strong>${feature.properties.TERRITORIO}</strong><br>${clasif}`,
            { sticky: true }
          );

          // =====================================
          // 🔥 CLICK CORREGIDO (NO TOCAR MÁS)
          // =====================================

          layer.on("click", () => {

            const key = nombre.trim().toUpperCase();

            // Guardamos estado global
            window.APP_STATE.territorio = key;
            window.APP_STATE.datos = CREF_DATA[key] || null;

            actualizarPanel(
              window.APP_STATE.territorio,
              window.APP_STATE.datos
            );

          });
        }

      }).addTo(map);

      map.fitBounds(capa.getBounds());

    })
    .catch(err => console.error("Error GEOJSON:", err));
}

// ===============================
// 🎯 LEYENDA CLASIFICACIÓN
// ===============================

const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {

  const div = L.DomUtil.create("div", "info legend");

  div.innerHTML = `
    <div style="
      background:white;
      padding:10px;
      border-radius:8px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      font-size:12px;
      line-height:18px;
    ">
      <strong>Clasificación</strong><br>
      <span style="background:#6a0dad;width:12px;height:12px;display:inline-block;margin-right:6px"></span>
      CREF y PAFTS<br>

      <span style="background:#0047ff;width:12px;height:12px;display:inline-block;margin-right:6px"></span>
      Solo PAFTS<br>

      <span style="background:#ff6600;width:12px;height:12px;display:inline-block;margin-right:6px"></span>
      Otros
    </div>
  `;

  return div;
};

legend.addTo(map);
