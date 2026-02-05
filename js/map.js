// ===============================
// MAPA
// ===============================
var map = L.map('map', {
  preferCanvas: false
}).setView([9.8, -83.7], 7);

// ===============================
// MAPAS BASE
// ===============================
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
).addTo(map);

var baseSatelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri' }
);

var baseOSM = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '© OpenStreetMap contributors' }
);

// ===============================
// CONTROL DE CAPAS
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
// ESTILOS
// ===============================
function estiloNormal() {
  return {
    interactive: true,
    color: '#ffffff',
    weight: 2,
    fillColor: '#ff5500',
    fillOpacity: 0.6
  };
}

function highlight(e) {
  var layer = e.target;

  layer.setStyle({
    color: '#FFD700',
    weight: 3,
    fillColor: '#ff8800',
    fillOpacity: 0.85
  });

  layer.bringToFront();
}

function reset(e) {
  territoriosLayer.resetStyle(e.target);
}

// ===============================
// EVENTOS + POPUP
// ===============================
function onEachFeature(feature, layer) {
  var p = feature.properties || {};

  layer.bindPopup(`
    <div class="popup-title">${p.TERRITORIO || 'Territorio indígena'}</div>
    <table class="popup-table">
      <tr><td><b>Decreto</b></td><td>${p.DECRETO || '-'}</td></tr>
      <tr><td><b>Año</b></td><td>${p.AÑO || '-'}</td></tr>
      <tr><td><b>Clasificación</b></td><td>${p.CLASIF || '-'}</td></tr>
      <tr><td><b>Área (ha)</b></td><td>${p.AREA_HA || '-'}</td></tr>
    </table>
  `);

  layer.on({
    mouseover: highlight,
    mouseout: reset,
    click: function () {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
      layer.openPopup();
    }
  });
}

// ===============================
// CARGA GEOJSON
// ===============================
var territoriosLayer;

fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {

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
  .catch(err => console.error(err));

// ===============================
// BOTÓN VISTA GENERAL
// ===============================
var boundsGeneral;

fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {
    boundsGeneral = L.geoJSON(data).getBounds();
  });

// Control personalizado
var botonVistaGeneral = L.control({ position: 'topleft' });

botonVistaGeneral.onAdd = function () {
  var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
  div.innerHTML = '🏠';
  div.title = 'Vista general';

  div.style.backgroundColor = '#000';
  div.style.color = '#fff';
  div.style.cursor = 'pointer';
  div.style.width = '34px';
  div.style.height = '34px';
  div.style.lineHeight = '34px';
  div.style.textAlign = 'center';
  div.style.fontSize = '18px';

  div.onclick = function () {
    if (boundsGeneral) {
      map.fitBounds(boundsGeneral, { padding: [20, 20] });
    }
  };

  return div;
};

botonVistaGeneral.addTo(map);

