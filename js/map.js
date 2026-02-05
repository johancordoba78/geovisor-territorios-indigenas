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
  { attribution: '&copy; OpenStreetMap contributors' }
);

// ===============================
// CONTROL DE CAPAS (BASES)
// ===============================
var controlCapas = L.control.layers(
  {
    "Mapa oscuro": baseOscuro,
    "Satélite": baseSatelite,
    "OpenStreetMap": baseOSM
  },
  {},
  { collapsed: false }
).addTo(map);

// ===============================
// ESTILOS TERRITORIOS
// ===============================
function estiloNormal() {
  return {
    color: '#ffffff',
    weight: 2,
    fillColor: '#ff5500',
    fillOpacity: 0.6
  };
}

function estiloResaltado(layer) {
  layer.setStyle({
    color: '#FFD700',
    weight: 3,
    fillColor: '#ff8800',
    fillOpacity: 0.85
  });

  layer.bringToFront();
}

function resetEstilo(layer) {
  territoriosLayer.resetStyle(layer);
}

// ===============================
// EVENTOS + POPUP
// ===============================
function onEachFeature(feature, layer) {
  var p = feature.properties || {};

  var html = `
    <div class="popup-title">${p.TERRITORIO || 'Territorio indígena'}</div>
    <table class="popup-table">
      <tr><td><b>Decreto</b></td><td>${p.DECRETO || '-'}</td></tr>
      <tr><td><b>Año</b></td><td>${p.AÑO || '-'}</td></tr>
      <tr><td><b>Clasificación</b></td><td>${p.CLASIF || '-'}</td></tr>
      <tr><td><b>Área (ha)</b></td><td>${p.AREA_HA || '-'}</td></tr>
    </table>
  `;

  layer.bindPopup(html);

  layer.on({
    mouseover: function () {
      estiloResaltado(layer);
    },
    mouseout: function () {
      resetEstilo(layer);
    },
    click: function () {
      map.fitBounds(layer.getBounds(), {
        padding: [20, 20],
        animate: true
      });
      layer.openPopup();
    }
  });
}

// ===============================
// CARGA GEOJSON
// ===============================
var territoriosLayer;

fetch('data/territorios_indigenas.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {

    territoriosLayer = L.geoJSON(data, {
      style: estiloNormal,
      onEachFeature: onEachFeature
    }).addTo(map);

    controlCapas.addOverlay(
      territoriosLayer,
      'Territorios indígenas'
    );

    map.fitBounds(territoriosLayer.getBounds());
  })
  .catch(function (err) {
    console.error('Error cargando territorios:', err);
  });

