// ===============================
// MAPA BASE
// ===============================

const map = L.map("map", {
  center: [9.6, -84.2],
  zoom: 7,
  layers: [baseMaps["OpenStreetMap"]]
});

L.control.layers(baseMaps).addTo(map);

// ===============================
// ESTILO POR CLASIFICACIÓN (DESDE GEOJSON)
// ===============================

function estiloTerritorio(feature) {
  const clasif = feature.properties.CLASIF;

  let fill = "#cccccc"; // Sin CREF ni PAFs (gris)

  if (clasif === "CREF y PAFs") fill = "#c67c2d";   // café
  if (clasif === "Solo PAFs") fill = "#f2c94c";    // amarillo

  return {
    color: "#444",
    weight: 1,
    fillColor: fill,
    fillOpacity: 0.7
  };
}

// ===============================
// CARGA DE TERRITORIOS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(res => res.json())
  .then(data => {

    L.geoJSON(data, {
      style: estiloTerritorio,

      onEachFeature: (feature, layer) => {
        const nombre = feature.properties.TERRITORIO
          ?.trim()
          .toUpperCase();

        const clasif = feature.properties.CLASIF;

        // Tooltip
        layer.bindTooltip(
          `<strong>${nombre}</strong><br>${clasif}`,
          { sticky: true }
        );

        // Click → panel
        layer.on("click", () => {
          const datos = CREF_DATA[nombre] || null;
          actualizarPanel(nombre, datos);
        });
      }
    }).addTo(map);

  })
  .catch(err => console.error("Error GeoJSON:", err));
