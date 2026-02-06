// ===============================
// CREAR MAPA
// ===============================

const map = L.map("map", {
  center: [9.6, -84.1],
  zoom: 7,
  layers: [baseMaps["Carto Claro"]]
});

// Control de mapas base
L.control.layers(baseMaps, null, { collapsed: false }).addTo(map);

// ===============================
// CAPA TERRITORIOS INDÍGENAS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(res => res.json())
  .then(data => {

    const capaTerritorios = L.geoJSON(data, {
      style: feature => ({
        color: "#ffffff",
        weight: 1,
        fillColor: "#c76b00",
        fillOpacity: 0.7
      }),

      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          const nombre = feature.properties.TERRITORIO?.toUpperCase();

          const cref = CREF_DATA[nombre];

          actualizarPanel({
            nombre,
            ...cref
          });
        });
      }
    }).addTo(map);

    // Ajustar vista a los territorios
    map.fitBounds(capaTerritorios.getBounds());

    console.log("✔ Territorios cargados");
  })
  .catch(err => console.error("❌ Error GeoJSON:", err));

