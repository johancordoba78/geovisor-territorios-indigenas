// ===============================
// MAPAS BASE
// ===============================

const baseMaps = {
  "OpenStreetMap": L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "© OpenStreetMap" }
  ),

  "Carto Claro": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    { attribution: "© CARTO" }
  ),

  "Carto Oscuro": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    { attribution: "© CARTO" }
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

// Control de mapas base
L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);

// ===============================
// TERRITORIOS INDÍGENAS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(res => res.json())
  .then(data => {

    const capaTerritorios = L.geoJSON(data, {

      style: feature => {
        const nombre = feature.properties.TERRITORIO?.trim().toUpperCase();
        const tieneCref = CREF_DATA[nombre];

        return {
          color: "#555",
          weight: 1,
          fillColor: tieneCref ? "#c67c2d" : "#999999",
          fillOpacity: 0.7
        };
      },

      onEachFeature: (feature, layer) => {
        const nombre = feature.properties.TERRITORIO?.trim().toUpperCase();
        const datos = CREF_DATA[nombre] || null;

        // TOOLTIP
        layer.bindTooltip(
          `<strong>${nombre}</strong><br>
           ${datos ? "Con datos CREF" : "Sin datos CREF"}`,
          {
            sticky: true,
            opacity: 0.9
          }
        );

        // CLICK → PANEL + ZOOM
        layer.on("click", () => {
          // Actualiza panel
          actualizarPanel(nombre, datos);

          // ZOOM AUTOMÁTICO AL TERRITORIO
          map.fitBounds(layer.getBounds(), {
            padding: [40, 40],
            maxZoom: 12,
            animate: true
          });
        });
      }

    });

    capaTerritorios.addTo(map);

  })
  .catch(err => console.error("Error cargando territorios:", err));
