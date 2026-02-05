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
  if (clasif === 'Solo PAFTS') return '#f1c40f';
  if (clasif === 'Sin CREF ni PAFTS') return '#7570b3';
  return '#e66101'; // CREF y PAFTS
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
// FILTROS (PASO A)
// ===============================
var filtrosClasif = {
  'CREF y PAFTS': true,
  'Solo PAFTS': true,
  'Sin CREF ni PAFTS': true
};

function filtroClasificacion(feature) {
  return filtrosClasif[feature.properties.CLASIF];
}

// ===============================
// EVENTOS + TOOLTIP + POPUP
// ===============================
function onEachFeature(feature, layer) {
  var p = feature.properties;

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
      <tr><td><b>Ár
