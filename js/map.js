// ===============================
// MAPA
// ===============================
var map = L.map('map').setView([9.8, -83.7], 7);

// ===============================
// MAPAS BASE
// ===============================

// Mapa oscuro
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
).addTo(map);

// Satélite
var baseSatelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri' }
);

// OpenStreetMap
var baseOSM = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '&copy; OpenStreetMap contributors' }
);

// ===============================
// CONTROL DE CAPAS (BASES + OVERLAYS)
// ===============================
var controlCapas = L.control.layers(
  {
    "Mapa oscuro": baseOscuro,
    "Satélite": baseSatelite,
    "OpenStreetMap": baseOSM
  },
  {}, // overlays VACÍOS por ahora
  { collapsed: false }
).addTo(map);

// ===============================
// TERRITORIOS INDÍGENAS
// ===============================
function estiloTerritorios() {
  return {
    color: '#ffffff',
    weight: 2,
    fillColor: '#ff5500',
    fillOpacity: 0.6
  };
}

var territoriosLayer;

fetch('data/territorios_indigenas.geojson')
  .then(res => res.json())
  .then(data => {

    territoriosLayer = L.geoJSON(data, {
      style: estiloTerritorios
    }).addTo(map);

    // Agregar al control de capas
    controlCapas.addOverlay(
      territoriosLayer,
      'Territorios indígenas'
    );

    // Ajustar vista
    map.fitBounds(territoriosLayer.getBounds());
  })
  .catch(err => console.error('Error cargando territorios:', err));

