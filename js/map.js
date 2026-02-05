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
// ESTILOS (SIMBOLOGÍA POR CLASIF)
// ===============================
function getColor(clasif) {
  if (clasif === 'Solo PAFTS') return '#e66101';
  if (clasif === 'PAFTS + PSA') return '#5e3c99';
  if (clasif === 'PSA') return '#1b7837';
  return '#ff5500';
}

function estiloNormal(feature) {
  return {
    interactive: true,
    color: '#ffffff',
    weight: 2,
    fillColor: getColor(feature.properties.CLASIF),
    fillOpacity: 0.65
  };
}

function highlight(e) {
  var layer = e.target;

  layer.setStyle({
    color: '#FFD700',
    weight: 3,
    fillColor: '#ffcc33',
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
    <div class="popup-title">${p.TERRITORIO}</div>
    <table class="popup-table">
      <tr><td><b>Decreto</b></td><td>${p.DECRETO}</td></tr>
      <tr><td><b>Año</b></td><td>${p.AÑO}</td></tr>
      <tr><td><b>Clasificación</b></td><td>${p.CLASIF}</td></tr>
      <tr><td><b>Área (ha)</b></td><td>${p.AREA_HA}</td></tr>
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
// LEYENDA
// ===============================
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');

  div.style.background = 'rgba(0,0,0,0.75)';
  div.style.color = '#fff';
  div.style.padding = '10px';
  div.style.fontSize = '12px';
  div.style.borderRadius = '6px';

  div.innerHTML = `
    <b>Clasificación</b><br>
    <i style="background:${getColor('Solo PAFTS')}; width:12px; height:12px; display:inline-block;"></i> Solo PAFTS<br>
    <i style="background:${getColor('PAFTS + PSA')}; width:12px; height:12px; display:inline-block;"></i> PAFTS + PSA<br>
    <i style="background:${getColor('PSA')}; width:12px; height:12px; display:inline-block;"></i> PSA
  `;

  return div;
};

legend.addTo(map);
