// MAPA
var map = L.map('map').setView([9.8, -83.7], 7);

// MAPA BASE
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
).addTo(map);

// CONTROL DE CAPAS
var controlCapas = L.control.layers(
  { "Mapa oscuro": baseOscuro },
  {},
  { collapsed: false }
).addTo(map);

// ESTILO
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
  e.target.setStyle({
    color: '#FFD700',
    weight: 3,
    fillColor: '#ff8800',
    fillOpacity: 0.85
  });
  e.target.bringToFront();
}

function reset(e) {
  geojson.resetStyle(e.target);
}

// EVENTOS
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlight,
    mouseout: reset,
    click: function () {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
  });
}

// CARGA GEOJSON
var geojson;

fetch('./data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {

    geojson = L.geoJSON(data, {
      style: estiloNormal,
      onEachFeature: onEachFeature
    }).addTo(map);

    controlCapas.addOverlay(geojson, 'Territorios indígenas');
    map.fitBounds(geojson.getBounds());
  })
  .catch(err => {
    console.error(err);
    alert('❌ No se pudo cargar el GeoJSON');
  });

