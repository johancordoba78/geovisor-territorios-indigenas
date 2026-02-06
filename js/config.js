// ===============================
// INICIALIZAR MAPA
// ===============================
const map = L.map("map").setView([9.6, -84.1], 7);

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

// 👉 MAPA BASE POR DEFECTO (OBLIGATORIO)
baseMaps["Carto Claro"].addTo(map);

// 👉 CONTROL DE CAPAS
L.control.layers(baseMaps, null, { collapsed: true }).addTo(map);

// ===============================
// DATOS CREF
// ===============================
const CREF_DATA = {
  "CABECAR TALAMANCA": {
    beneficiario: "Asociación ...",
    area_2024: 25409.16,
    variacion: 0,
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  },
  "BORUCA": {
    beneficiario: "Asociación de Desarrollo Integral de la Reserva Indígena de Boruca",
    area_2024: 1509.26,
    variacion: 124.4,
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  }
};

// ===============================
// CARGAR TERRITORIOS INDÍGENAS
// ===============================
fetch("data/territorios_indigenas.geojson")
  .then(res => res.json())
  .then(geojson => {

    const capaTerritorios = L.geoJSON(geojson, {
      style: feature => ({
        color: "#333",
        weight: 1,
        fillColor: "#c76b00",
        fillOpacity: 0.7
      }),

      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          const nombre =
            feature.properties.TERRITORIO
              ?.trim()
              .toUpperCase();

          console.log("Territorio clic:", nombre);

          if (nombre && CREF_DATA[nombre]) {
            actualizarPanel({
              nombre,
              ...CREF_DATA[nombre]
            });
          } else {
            actualizarPanel({ nombre });
          }
        });
      }
    }).addTo(map);

    // Ajustar vista al país
    map.fitBounds(capaTerritorios.getBounds());
  })
  .catch(err => console.error("Error GeoJSON:", err));

