// ===============================
// MAPA BASE
// ===============================
var map = L.map('map').setView([9.8, -83.7], 8);

// Fondo negro real
map.getContainer().style.background = '#000000';

// ===============================
// MAPAS BASE
// ===============================

// 🌑 Base oscuro
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
);

// 🛰️ Base satélite
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
// ESTILO NORMAL DE TERRITORIOS
// ===============================
function estiloTerritorios() {
  return {
    pane: 'territoriosPane',
    color: '#FFFFFF',      // borde blanco
    weight: 2,
    opacity: 1,
    fillColor: '#ff5500',  // 🟧 COLOR DEFINITIVO
    fillOpacity: 0.65,
    interactive: true
  };
}

// ===============================
// HOVER (RESALTADO)
// ===============================
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    color: '#FFD700',      // amarillo
    weight: 3,
    fillColor: '#ff8800',
    fillOpacity: 0.85
  });

  layer.bringToFront();
}

// ===============================
// RESET ESTILO
// ===============================
function resetHighlight(e) {
  territoriosLayer.resetStyle(e.target);
}

// ===============================
// POPUP + EVENTOS
// ===============================
function onEachFeature(feature, layer) {
  var p = feature.properties;

  var foto  = p.FOTO  ? p.FOTO  : 'fotos/sin_foto.jpg';
  var ficha = p.FICHA ? p.FICHA : 'fichas/en_construccion.html';

  var html = `
    <div class="popup-title">${p.TERRITORIO}</div>
    <img src="${foto}" class="popup-img">
    <table class="popup-table">
      <tr><td><b>Decreto</b></td><td>${p.DECRETO}</td></tr>
      <tr><td><b>Año</b></td><td>${p.AÑO}</td></tr>
      <tr><td><b>Clasificación</b></td><td>${p.CLASIF}</td></tr>
      <tr><td><b>Área (ha)</b></td><td>${p.AREA_HA}</td></tr>
    </table>
    <a href="${ficha}" target="_blank" class="popup-btn">
      Ver ficha técnica
    </a>
  `;

  layer.bindPopup(html);

  // Hover
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: function () {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
  });
}

// ===============================
// CAPA TERRITORIOS
// ===============================
var territoriosLayer;
var etiquetasLayer;

// ===============================
// CARGA DEL GEOJSON
// ===============================
fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {

    // Polígonos
    territoriosLayer = L.geoJSON(data, {
      style: estiloTerritorios,
      onEachFeature: onEachFeature
    }).addTo(map);

    // Etiquetas
    etiquetasLayer = L.geoJSON(data, {
      pane: 'labelsPane',
      interactive: false,
      onEachFeature: function (feature, layer) {
        layer.bindTooltip(
          feature.properties.TERRITORIO,
          {
            permanent: true,
            direction: 'center',
            className: 'territorio-label'
          }
        );
      }
    }).addTo(map);

    // ===============================
    // CONTROL DE CAPAS
    // ===============================
    var mapasBase = {
      "Mapa oscuro": baseOscuro,
      "Satélite": baseSatelite
    };

    var overlays = {
      "Territorios indígenas": territoriosLayer,
      "Nombres de territorios": etiquetasLayer
    };

    L.control.layers(mapasBase, overlays, {
      collapsed: false
    }).addTo(map);

    // Zoom inicial
    map.fitBounds(territoriosLayer.getBounds());

    // ===============================
    // LEYENDA
    // ===============================
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `
        <h4>Territorios</h4>
        <i style="background:#ff5500"></i> Territorio indígena<br>
        <i style="background:#FFD700"></i> Territorio seleccionado
      `;
      return div;
    };

    legend.addTo(map);

  })
  .catch(err => console.error('Error cargando GeoJSON:', err));
