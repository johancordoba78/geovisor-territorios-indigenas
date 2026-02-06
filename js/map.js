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

    data.features.forEach(f => {
      const nombre = f.properties.TERRITORIO
        ? f.properties.TERRITORIO.trim().toUpperCase()
        : null;

      if (nombre && CREF_DATA[nombre]) {
        f.properties.CREF = CREF_DATA[nombre];
        f.properties.TIENE_CREF = true;
      } else {
        f.properties.CREF = null;
        f.properties.TIENE_CREF = false;
      }
    });

    const capaTerritorios = L.geoJSON(data, {
      style: f => ({
        color: "#444",
        weight: 1,
        fillColor: f.properties.TIENE_CREF ? "#c77d2a" : "#999",
        fillOpacity: 0.7
      }),
      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          map.fitBounds(layer.getBounds(), { padding: [30, 30] });
          actualizarPanel(feature.properties);
        });
      }
    }).addTo(map);

    // 🔥 Zoom automático al cargar
    map.fitBounds(capaTerritorios.getBounds(), { padding: [40, 40] });

  })
  .catch(err => console.error("Error cargando GeoJSON:", err));
