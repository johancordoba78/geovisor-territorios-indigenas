// ===============================
// MAPA
// ===============================
var map = L.map('map').setView([9.8, -83.7], 8);

// ===============================
// MAPAS BASE
// ===============================

// 🟦 OpenStreetMap
var baseOSM = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '&copy; OpenStreetMap contributors' }
);

// 🌑 Mapa oscuro
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
);

// 🛰️ Satélite
var baseSatelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri' }
);

// 👉 Base por defecto
baseOscuro.addTo(map);

// ===============================
// ESTILO TERRITORIOS
// ===============================
function estiloNormal() {
  return {
    color: '#ffffff',      // borde blanco
    weight: 2,
    opacity: 1,
    fillColor: '#ff5500',  // naranja institucional
    fillOpacity: 0.65
  };
}

// ===============================
// HOVER
// ===============================
function estiloHover(e) {
  e.target.setStyle({
    color: '#FFD700',
    weight: 3,
    fillColor: '#ff8800',
    fillOpacity: 0.85
  });
  e.target.bringToFront();
}

function resetHover(e) {
  territorios.resetStyle(e.target);
}

// ===============================
// POPUP
// ===============================
function onEachFeature(feature, layer) {
  var p = feature.properties;

  var html = `
    <div class="popup-title">${p.TERRITORIO}</div>
    <table class="popup-table">
      <tr><td><b>Decreto</b></td><td>${p.DECRETO}</td></tr>
      <tr><td><b>Año</b></td><td>${p.AÑO}</td></tr>
      <tr><td><b>Clasificación</b></td><td>${p.CLASIF}</td></tr>
      <tr><td><b>Área (ha)</b></td><td>${p.AREA_HA}</td></tr>
    </table>
  `;

  layer.bindPopup(html);

  layer.on({
    mouseover: estiloHover,
    mouseout: resetHover,
    click: function () {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
  });
}

// ===============================
// CAPA TERRITORIOS
// ===============================
var territorios;

// ===============================
// CARGA GEOJSON
// ===============================
fetch('data/territorios_indigenas.geojson')
  .then(res => res.json())
  .then(data => {

    territorios = L.geoJSON(data, {
      style: estiloNormal,
      onEachFeature: onEachFeature
    }).addTo(map);

    map.fitBounds(territorios.getBounds());

    // ===============================
    // CONTROL DE CAPAS (ORDEN CORRECTO)
    // ===============================
    var capasVectoriales = {
      "Territorios indígenas": territorios
    };

    var mapasBase = {
      "OpenStreetMap": baseOSM,
      "Mapa oscuro": baseOscuro,
      "Satélite": baseSatelite
    };

    L.control.layers(mapasBase, capasVectoriales, {
      collapsed: false
    }).addTo(map);
  })
  .catch(err => console.error('Error cargando GeoJSON:', err));
