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
// CONTROL DE CAPAS BASE
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
// SIMBOLOGÍA POR CLASIFICACIÓN
// ===============================
function getColor(clasif) {
  if (clasif === 'Solo PAFTS') return '#f1c40f';        // amarillo
  if (clasif === 'Sin CREF ni PAFTS') return '#7570b3'; // morado
  return '#e66101';                                   // CREF y PAFTS
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
// FILTRO PASO A (CLASIFICACIÓN)
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
// EVENTOS + TOOLTIP + POPUP
// ===============================
function onEachFeature(feature, layer) {
  var p = feature.properties || {};

  layer.bindTooltip(p.TERRITORIO, {
    sticky: true,
    direction: 'top',
    opacity: 0.9
  });

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
// CARGA GEOJSON + BUSCADOR (PASO B)
// ===============================
var territoriosLayer;
var searchControl;

fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {

    territoriosLayer = L.geoJSON(data, {
      style: estiloNormal,
      onEachFeature: onEachFeature,
      filter: filtroClasificacion
    }).addTo(map);

    controlCapas.addOverlay(
      territoriosLayer,
      'Territorios indígenas'
    );

    map.fitBounds(territoriosLayer.getBounds());

    // 🔍 BUSCADOR DE TERRITORIOS (PASO B)
    searchControl = new L.Control.Search({
      layer: territoriosLayer,
      propertyName: 'TERRITORIO',
      zoom: 11,
      initial: false,
      hideMarkerOnCollapse: true,
      textPlaceholder: 'Buscar territorio…'
    });

    searchControl.on('search:locationfound', function (e) {
      e.layer.setStyle({
        color: '#00ffff',
        weight: 4
      });
      e.layer.openPopup();
    });

    searchControl.on('search:collapsed', function () {
      territoriosLayer.resetStyle();
    });

    map.addControl(searchControl);
  })
  .catch(err => console.error(err));

// ===============================
// LEYENDA
// ===============================
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML = `
    <b>Clasificación</b><br>
    <i style="background:#e66101"></i> CREF y PAFTS<br>
    <i style="background:#f1c40f"></i> Solo PAFTS<br>
    <i style="background:#7570b3"></i> Sin CREF ni PAFTS
  `;
  return div;
};

legend.addTo(map);

// ===============================
// CONTROL PASO A – CHECKBOX
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

// Eventos checkbox
document.addEventListener('change', function (e) {
  if (!e.target.dataset.clasif) return;

  filtrosClasif[e.target.dataset.clasif] = e.target.checked;

  territoriosLayer.clearLayers();
  fetch('data/territorios_indigenas.geojson')
    .then(r => r.json())
    .then(data => {
      territoriosLayer.addData(data);
    });
});

