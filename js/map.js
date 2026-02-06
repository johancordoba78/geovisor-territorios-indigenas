// ===============================
// MAPA
// ===============================

const map = L.map("map", {
  center: [9.6, -84.1],
  zoom: 7,
  layers: [baseMaps["Carto Claro"]]
});

L.control.layers(baseMaps).addTo(map);

// ===============================
// TERRITORIOS INDÍGENAS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(res => res.json())
  .then(data => {

    L.geoJSON(data, {
      style: feature => {
        const nombre = feature.properties.TERRITORIO
          ?.trim()
          .toUpperCase();

        return {
          color: "#555",
          weight: 1,
          fillColor: CREF_DATA[nombre] ? "#c97a2b" : "#cccccc",
          fillOpacity: 0.7
        };
      },

      onEachFeature: (feature, layer) => {

        layer.on("click", () => {
          const nombre = feature.properties.TERRITORIO
            ?.trim()
            .toUpperCase();

          const datos = CREF_DATA[nombre] || null;

          actualizarPanel(nombre, datos);
          map.fitBounds(layer.getBounds());
        });

      }

    }).addTo(map);

  })
  .catch(err => console.error("Error cargando territorios:", err));
