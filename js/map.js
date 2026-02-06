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
// ESTILO
// ===============================

function estiloTerritorio(feature) {
  const nombre = feature.properties.TERRITORIO?.trim().toUpperCase();
  const datos = CREF_DATA[nombre];

  let fill = "#999999"; // Sin datos

  if (datos?.clasif === "CREF y PAFs") fill = "#c67c2d";
  if (datos?.clasif === "Solo PAFs") fill = "#f2c94c";

  return {
    color: "#444",
    weight: 1,
    fillColor: fill,
    fillOpacity: 0.7
  };
}

// ===============================
// TERRITORIOS
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

        layer.on("click", () => {
          actualizarPanel(nombre, CREF_DATA[nombre] || null);
        });
      }
    }).addTo(map);
  })
  .catch(err => console.error(err));
