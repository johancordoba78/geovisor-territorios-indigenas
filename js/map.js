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
// SIMBOLOGÍA (CLASIF REAL)
// ===============================
// CLASES EXISTENTES:
// - "CREF y PAFTS"
// - "Solo PAFTS"
// - "Sin CREF ni PAFTS"

function getColor(clasif) {
  if (clasif === 'Sin CREF ni PAFTS') {
    return '#7570b3'; // SIN instrumentos
  }
  return '#e66101'; // CREF y PAFTS + Solo PAFTS
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

// ===============================
// INTERACCIÓN
// ===============================
function highlight(e) {
  var layer = e.target;
  layer.setStyle({
    color: '#FFD700',
    weight: 3,
    fillOpacity: 0.85
  });
  layer.bringToFront();
}

function reset(e) {
  territoriosLayer.resetStyle(e.target);
}

// ===============================
// EVENTOS + TOOLTIP + POPUP
// ===============================
function onEachFeature(feature, layer) {
  var p = feature.properties || {};

  // Tooltip (nombre del territorio)
  layer.bindTooltip(p.TERRITORIO, {
    sticky: true,
    direction: 'top',
    opacity: 0.9
  });

  // Popup
  layer.bindPopup(`
    <div class="popup-title">${p.TERRITORIO}</div>
    <table class="popup-table">
      <tr><td><b>Decreto</b></td><td>${p.DECRETO}</td></tr>
      <tr><td><b>Año</b></td><td>${p.AÑO}</td></tr>
      <tr><td><b>Clasificación</b></td><td>${p.CLASIF}</td></tr>
      <tr>
        <td><b>Área (ha)</b></td>
        <td>${Number(p.AREA_HA).toLocaleString('es-CR', { maximumFractionDigits: 0 })}</td>
      </tr>
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
// LEYENDA (ÚNICA Y CORRECTA)
// ===============================
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');

  div.innerHTML = `
    <b>Clasificación</b><br>
    <i style="background:#e66101"></i> CREF y PAFTS / Solo PAFTS<br>
    <i style="background:#7570b3"></i> Sin CREF ni PAFTS
  `;

  return div;
};

legend.addTo(map);
