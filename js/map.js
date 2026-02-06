// ===============================
// MAPAS BASE
// ===============================

const osm = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { attribution: "© OpenStreetMap" }
);

const carto = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  { attribution: "© CARTO" }
);

const satelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { attribution: "© Esri" }
);

// ===============================
// MAPA
// ===============================

const map = L.map("map", {
  center: [9.6, -84.1],
  zoom: 7,
  layers: [carto]
});

// ===============================
// TERRITORIOS
// ===============================

let capaTerritorios;

fetch("data/territorios_indigenas.geojson")
  .then(r => r.json())
  .then(data => {

    data.features.forEach(f => {
      const nombre = f.properties.TERRITORIO?.trim().toUpperCase();
      f.properties.CREF = CREF_DATA[nombre] || null;
    });

    capaTerritorios = L.geoJSON(data, {
      style: {
        color: "#ffffff",
        weight: 1,
        fillColor: "#c76b00",
        fillOpacity: 0.7
      },
      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          actualizarPanel(feature.properties);
          map.fitBounds(layer.getBounds(), { padding: [30, 30] });
        });
      }
    }).addTo(map);

    // ===============================
    // CONTROL DE CAPAS
    // ===============================

    L.control.layers(
      {
        "Carto claro": carto,
        "OpenStreetMap": osm,
        "Satélite": satelite
      },
      {
        "Territorios indígenas": capaTerritorios
      },
      { collapsed: false }
    ).addTo(map);
  });
