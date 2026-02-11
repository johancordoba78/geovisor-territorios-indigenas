// ===============================
// MAPAS BASE (claro)
// ===============================

const baseMaps = {
  "Base Claro": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
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
// ESTILO SEGÚN CLASIFICACIÓN (DEL GEOJSON)
// ===============================

function estiloTerritorio(feature) {

  const clasif = (feature.properties.CLASIF || "")
    .trim()
    .toUpperCase();

  let fillColor = "#ff7a00"; // 🟠 Sin CREF ni PAFTS

  if (clasif === "CREF Y PAFTS") fillColor = "#6a00ff"; // 🟣
  if (clasif === "SOLO PAFTS") fillColor = "#0055ff";   // 🔵

  return {
    color: "#ffffff",   // borde blanco
    weight: 2,
    fillColor: fillColor,
    fillOpacity: 0.85
  };
}

// ===============================
// HOVER (REALCE AMARILLO)
// ===============================

function hoverOn(e) {
  const layer = e.target;

  layer.setStyle({
    color: "#ffff00",
    weight: 4,
    fillOpacity: 1
  });

  layer.bringToFront();
}

function hoverOff(e) {
  const layer = e.target;
  layer.setStyle(estiloTerritorio(layer.feature));
}

// ===============================
// CARGAR DATOS CREF (JSON)
// ===============================

let CREF_DATA = {};

fetch("data/cref_por_territorio.json")
  .then(r => r.json())
  .then(data => {
    CREF_DATA = data;
    cargarTerritorios();
  });

// ===============================
// CARGAR TERRITORIOS GEOJSON
// ===============================

function cargarTerritorios() {

  fetch("data/territorios_indigenas.geojson")
    .then(r => r.json())
    .then(data => {

      L.geoJSON(data, {

        style: estiloTerritorio,

        onEachFeature: (feature, layer) => {

          const nombre = feature.properties.TERRITORIO
            ?.trim()
            .toUpperCase();

          const clasif = feature.properties.CLASIF || "";

          // TOOLTIP
          layer.bindTooltip(
            `<strong>${feature.properties.TERRITORIO}</strong><br>${clasif}`,
            { sticky: true }
          );

          // HOVER
          layer.on({
            mouseover: hoverOn,
            mouseout: hoverOff,
            click: () => {
              actualizarPanel(nombre, CREF_DATA[nombre] || null);
            }
          });

        }

      }).addTo(map);

    });

}
