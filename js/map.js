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
    color: '#000000',
    weight: 2,
    fillColor: '#ff6600',
    fillOpacity: 0.65
  };
}

function highlight(e) {
  e.target.setStyle({
    color: '#FFD700',
    weight: 3,
    fillColor: '#ff8800',
    fillOpacity: 0.85
  });
  e.target.bringToFront();
}

function reset(e) {
  e.target.setStyle(estiloNormal());
}

// ===============================
// PANEL
// ===============================
function actualizarPanel(p) {
  document.getElementById('detalle').innerHTML = `
    <b>${p.TERRITORIO || '-'}</b><br>
    Decreto: ${p.DECRETO || '-'}<br>
    Año: ${p.AÑO || '-'}<br>
    Clasificación: ${p.CLASIF || '-'}<br>
    Área (ha): ${Number(p.AREA_HA || 0).toLocaleString('es-CR')}
  `;
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
      actualizarPanel(p);
      layer.openPopup();
    }
  });
}

// ===============================
// KPIs
// ===============================
function calcularKPIs(data) {
  let total = data.features.length;
  let area = 0;

  data.features.forEach(f => {
    area += Number(f.properties.AREA_HA || 0);
  });

  document.getElementById('kpi-total').textContent = total;
  document.getElementById('kpi-area').textContent =
    area.toLocaleString('es-CR', { maximumFractionDigits: 0 });
}

// ===============================
// CARGA GEOJSON
// ===============================
var territoriosLayer;

fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {

    calcularKPIs(data);

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

