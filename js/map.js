// ===============================
// MAPAS BASE
// ===============================

const baseMaps = {
  "OpenStreetMap": L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "© OpenStreetMap" }
  )
};

// ===============================
// MAPA
// ===============================

const map = L.map("map", {
  center: [9.6, -84.2],
  zoom: 7,
  layers: [baseMaps["OpenStreetMap"]]
});

L.control.layers(baseMaps).addTo(map);

// ===============================
// ESTILO POR CLASIFICACIÓN (GeoJSON)
// ===============================

function estiloTerritorio(feature) {
  const clasif = (feature.properties.CLASIF || "")
    .trim()
    .toUpperCase();

  let fillColor = "#cccccc"; // Sin CREF ni PAFTS

  if (clasif === "CREF Y PAFTS") fillColor = "#c67c2d";
  if (clasif === "SOLO PAFTS") fillColor = "#f2c94c";

  return {
    color: "#444",
    weight: 1,
    fillColor,
    fillOpacity: 0.7
  };
}

// ===============================
// CARGA DE TERRITORIOS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(r => r.json())
  .then(data => {
    L.geoJSON(data, {
      style: estiloTerritorio,
      onEachFeature: (feature, layer) => {
        const nombre = feature.properties.TERRITORIO
          ?.trim()
          .toUpperCase();

        layer.bindTooltip(
          `<strong>${feature.properties.TERRITORIO}</strong><br>
           ${feature.properties.CLASIF}`,
          { sticky: true }
        );

        layer.on("click", () => {
          actualizarPanel(nombre, CREF_DATA[nombre] || null);
        });
      }
    }).addTo(map);
  })
  .catch(console.error);
;
