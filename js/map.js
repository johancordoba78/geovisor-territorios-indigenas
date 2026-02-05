// ===============================
// MAPA
// ===============================
var map = L.map('map').setView([9.8, -83.7], 7);

// ===============================
// MAPAS BASE
// ===============================
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
).addTo(map);

var baseSatelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri' }
);

var baseOSM = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '&copy; OpenStreetMap' }
);

// ===============================
// ESTILO TERRITORIOS
// ===============================
function estiloTerritorios() {
  return {
    color: '#ffffff',
    weight: 2,
    fillColor: '#ff5500',
    fillOpacity: 0.6
  };
}

// ===============================
// POPUP CON ATRIBUTOS
// ===============================
function onEachFeature(feature, layer) {
  var p = feature.properties;

  var html = `
    <div class="popup-title">${p.TERRITORIO || 'Sin nombre'}</div>
    <table class="popup-table">
      <tr><td><b>Decreto</b></td><td>${p.DECRETO || '-'}</td></tr>
      <tr><td><b>Año</b></td><td>${p.AÑO || '-'}</td></tr>
      <tr><td><b>Clasificación</b></td><td>${p.CLASIF || '-'}</td></tr>
      <tr><td><b>Área (ha)</b></td><td>${p.AREA_HA || '-'}</td></tr>
    </table>
  `;

  layer.bindPopup(html);
}

// ===============================
// CARGA GEOJSON
// ===============================
var territoriosLayer;

fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {

    territoriosLayer = L.geoJSON(data, {
      style: estiloTerritorios,
      onEachFeature: onEachFeature
    }).addTo(map);

    map.fitBounds(territoriosLayer.getBounds());

    // ===============================
    // CONTROL DE CAPAS (BASES + VECTOR)
    // ===============================
    L.control.layers(
      {
        "Mapa oscuro": baseOscuro,
        "Satélite": baseSatelite,
        "OpenStreetMap": baseOSM
      },
      {
        "Territorios indígenas": territoriosLayer
      },
      { collapsed: false }
    ).addTo(map);
  })
  .catch(err => console.error('Error cargando GeoJSON:', err));

