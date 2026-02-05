// ===============================
// MAPA BASE
// ===============================
var map = L.map('map').setView([9.8, -83.7], 8);
map.getContainer().style.background = '#000000';

// ===============================
// MAPAS BASE
// ===============================
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
);

var baseSatelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri' }
);

// Base por defecto
baseOscuro.addTo(map);

// ===============================
// PANES
// ===============================
map.createPane('territoriosPane');
map.getPane('territoriosPane').style.zIndex = 450;

map.createPane('labelsPane');
map.getPane('labelsPane').style.zIndex = 500;
map.getPane('labelsPane').style.pointerEvents = 'none';

// ===============================
// ESTILO TERRITORIOS
// ===============================
function estiloTerritorios() {
  return {
    pane: 'territoriosPane',
    color: '#FFFFFF',
    weight: 2,
    fillColor: '#ff5500',
    fillOpacity: 0.65,
    interactive: true
  };
}

// ===============================
// HOVER
// ===============================
function highlightFeature(e) {
  e.target.setStyle({
    color: '#FFD700',
    weight: 3,
    fillColor: '#ff8800',
    fillOpacity: 0.85
  });
}

function resetHighlight(e) {
  territoriosLayer.resetStyle(e.target);
}

// ===============================
// CAPAS
// ===============================
var territoriosLayer;
var etiquetasLayer;

// ===============================
// GEOJSON
// ===============================
fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {

    // Territorios
    territoriosLayer = L.geoJSON(data, {
      style: estiloTerritorios,
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: function () {
            map.fitBounds(layer.getBounds(), { padding: [20, 20] });
          }
        });
      }
    }).addTo(map);

    // Etiquetas
    etiquetasLayer = L.geoJSON(data, {
      pane: 'labelsPane',
      interactive: false,
      onEachFeature: function (feature, layer) {
        layer.bindTooltip(feature.properties.TERRITORIO, {
          permanent: true,
          direction: 'center',
          className: 'territorio-label'
        });
      }
    }).addTo(map);

    // ===============================
    // CONTROL DE CAPAS
    // ===============================
    L.control.layers(
      {
        "Mapa oscuro": baseOscuro,
        "Satélite": baseSatelite
      },
      {
        "Territorios indígenas": territoriosLayer,
        "Nombres de territorios": etiquetasLayer
      },
      { collapsed: false }
    ).addTo(map);

    // ===============================
    // LEYENDA
    // ===============================
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML =
        '<b>Territorios</b><br>' +
        '<i style="background:#ff5500"></i> Territorio indígena<br>' +
        '<i style="background:#FFD700"></i> Hover';
      return div;
    };
    legend.addTo(map);

    // Zoom inicial
    map.fitBounds(territoriosLayer.getBounds());

  })
  .catch(err => console.error(err));

