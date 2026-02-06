// ===============================
// MAPA
// ===============================
var map = L.map('map').setView([9.8, -83.7], 7);

// ===============================
// MAPAS BASE
// ===============================
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
).addTo(map);

var baseSatelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
);

var baseOSM = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
);

var controlCapas = L.control.layers({
  "Mapa oscuro": baseOscuro,
  "Satélite": baseSatelite,
  "OpenStreetMap": baseOSM
}).addTo(map);

// ===============================
// SIMBOLOGÍA
// ===============================
function getColor(c) {
  if (c === 'Solo PAFTS') return '#f1c40f';
  if (c === 'Sin CREF ni PAFTS') return '#7570b3';
  return '#e66101';
}

function estiloNormal(feature) {
  return {
    color: '#ffffff',
    weight: 2,
    fillColor: getColor(feature.properties.CLASIF),
    fillOpacity: 0.65
  };
}

// ===============================
// FILTROS
// ===============================
var filtrosClasif = {
  'CREF y PAFTS': true,
  'Solo PAFTS': true,
  'Sin CREF ni PAFTS': true
};

function filtroClasificacion(feature) {
  return filtrosClasif[feature.properties.CLASIF] === true;
}

// ===============================
// KPIs
// ===============================
function actualizarKPIs() {
  var total = 0;
  var area = 0;
  var clasif = {};

  territoriosLayer.eachLayer(function (layer) {
    var p = layer.feature.properties;
    total++;
    area += Number(p.AREA_HA) || 0;
    clasif[p.CLASIF] = (clasif[p.CLASIF] || 0) + 1;
  });

  document.getElementById('kpi-total').innerHTML =
    '<b>Territorios:</b> ' + total;

  document.getElementById('kpi-area').innerHTML =
    '<b>Área total:</b> ' + area.toLocaleString('es-CR', {maximumFractionDigits:0}) + ' ha';

  let html = '<b>Por clasificación:</b><br>';
  for (let k in clasif) {
    html += k + ': ' + clasif[k] + '<br>';
  }
  document.getElementById('kpi-clasif').innerHTML = html;
}

// ===============================
// CARGA GEOJSON
// ===============================
var territoriosLayer;
var territoriosData;

fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {

    territoriosData = data;

    territoriosLayer = L.geoJSON(data, {
      style: estiloNormal,
      filter: filtroClasificacion
    }).addTo(map);

    map.fitBounds(territoriosLayer.getBounds());
    actualizarKPIs();
  });

// ===============================
// CONTROL FILTROS
// ===============================
var controlFiltros = L.control({ position: 'topright' });

controlFiltros.onAdd = function () {
  var div = L.DomUtil.create('div', 'filtros');
  div.innerHTML = `
    <b>Filtrar clasificación</b><br>
    <label><input type="checkbox" checked data-clasif="CREF y PAFTS"> CREF y PAFTS</label><br>
    <label><input type="checkbox" checked data-clasif="Solo PAFTS"> Solo PAFTS</label><br>
    <label><input type="checkbox" checked data-clasif="Sin CREF ni PAFTS"> Sin CREF ni PAFTS</label>
  `;
  return div;
};

controlFiltros.addTo(map);

document.addEventListener('change', function (e) {
  if (!e.target.dataset.clasif) return;

  filtrosClasif[e.target.dataset.clasif] = e.target.checked;
  territoriosLayer.clearLayers();
  territoriosLayer.addData(territoriosData);
  actualizarKPIs();
});
