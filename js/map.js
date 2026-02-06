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
// NORMALIZAR NOMBRES
// ===============================

function normalizarNombre(nombre) {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
}

// ===============================
// CARGAR TERRITORIOS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(r => r.json())
  .then(data => {

    data.features.forEach(f => {
      const nombre = normalizarNombre(f.properties.TERRITORIO);

      if (CREF_DATA[nombre]) {
        f.properties.CREF = CREF_DATA[nombre];
        f.properties.TIENE_CREF = true;
      } else {
        f.properties.CREF = null;
        f.properties.TIENE_CREF = false;
      }
    });

    L.geoJSON(data, {
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

  })
  .catch(err => console.error("Error cargando GeoJSON:", err));
