// ===============================
// MAPA
// ===============================

const map = L.map("map", {
  center: [9.8, -84],
  zoom: 7,
  layers: [baseMaps["Carto Claro"]]
});

// Control de mapas base
L.control.layers(baseMaps, null, { collapsed: false }).addTo(map);

// ===============================
// TERRITORIOS INDÍGENAS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(r => r.json())
  .then(data => {

    const capaTerritorios = L.geoJSON(data, {
      style: f => ({
        color: "#ffffff",
        weight: 1,
        fillColor: "#c76b00",
        fillOpacity: 0.7
      }),
      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          const nombre = feature.properties.TERRITORIO?.trim().toUpperCase();
          if (CREF_DATA[nombre]) {
            actualizarPanel({
              TERRITORIO: nombre,
              ...CREF_DATA[nombre]
            });
          }
        });
      }
    }).addTo(map);

    // 🔑 ESTO ES LO QUE TE FALTABA
    map.fitBounds(capaTerritorios.getBounds());

  })
  .catch(err => console.error("Error GeoJSON:", err));
