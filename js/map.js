// ===============================
// MAPA BASE (CLARO)
// ===============================

const baseMaps = {
  "Base Claro": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    { attribution: "© CARTO" }
  )
};

// ===============================
// MAPA
// ===============================

const map = L.map("map", {
  center: [9.6, -84.2],
  zoom: 7,
  layers: [baseMaps["Base Claro"]]
});

L.control.layers(baseMaps).addTo(map);

// ===============================
// ESTILO POR CLASIFICACIÓN (DESDE GEOJSON)
// ===============================

function estiloTerritorio(feature) {

  const clasif = (feature.properties.CLASIF || "")
    .trim()
    .toUpperCase();

  let fillColor = "#ff7f00"; // 🟠 SIN CREF NI PAFTS

  if (clasif === "CREF Y PAFTS") fillColor = "#6a00ff"; // 🟣 MORADO
  if (clasif === "SOLO PAFTS") fillColor = "#0047ff";   // 🔵 AZUL

  return {
    color: "#ffffff",   // borde blanco grueso
    weight: 2.5,
    fillColor: fillColor,
    fillOpacity: 0.85
  };
}

// ===============================
// ESTILO HOVER (REALCE AMARILLO)
// ===============================

function hoverOn(e) {
  const layer = e.target;

  layer.setStyle({
    weight: 3,
    color: "#ffff00",
    fillOpacity: 1
  });

  layer.bringToFront();
}

function hoverOff(e) {
  geojson.resetStyle(e.target);
}

// ===============================
// CARGAR DATOS CREF DESDE JSON
// ===============================

let CREF_DATA = {};

fetch("data/cref_por_territorio.json")
  .then(r => r.json())
  .then(data => {
    CREF_DATA = data;
    cargarTerritorios();
  });

// ===============================
// CARGAR GEOJSON
// ===============================

let geojson;

function cargarTerritorios() {

  fetch("data/territorios_indigenas.geojson")
    .then(r => r.json())
    .then(data => {

      geojson = L.geoJSON(data, {

        style: estiloTerritorio,

        onEachFeature: (feature, layer) => {

          const nombre = feature.properties.TERRITORIO
            ?.trim()
            .toUpperCase();

          const clasif = feature.properties.CLASIF || "Sin clasificación";

          // 🔥 TOOLTIP CON CLASIFICACIÓN
          layer.bindTooltip(
            `<strong>${feature.properties.TERRITORIO}</strong><br>${clasif}`,
            { sticky: true }
          );

          // 🟡 HOVER
          layer.on({
            mouseover: hoverOn,
            mouseout: hoverOff
          });

          // 👆 CLICK → PANEL
          layer.on("click", () => {
            actualizarPanel(nombre, CREF_DATA[nombre] || null);
          });
        }

      }).addTo(map);

    });
}
