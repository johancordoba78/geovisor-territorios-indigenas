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
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri' }
);

// Base por defecto
baseOscuro.addTo(map);

// ===============================
// ESTILO NORMAL DE TERRITORIOS
// ===============================
function estiloTerritorios() {
  return {
    color: '#FFFFFF',      // borde blanco
    weight: 2,
    opacity: 1,
    fillColor: '#ff5500',  // naranja
    fillOpacity: 0.65,
    interactive: true
  };
}

// ===============================
// HOVER (RESALTADO AMARILLO)
// ===============================
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    color: '#FFD700',     // amarillo
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

// ===============================
// CARGA DEL GEOJSON
// ===============================
fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {

    territoriosLayer = L.geoJSON(data, {
      style: estiloTerritorios,
      onEachFeature: onEachFeature
    }).addTo(map);

    // ===============================
    // CONTROL DE CAPAS EN ÁRBOL
    // ===============================
    var baseTree = {
      label: "🗺️ Mapas base",
      children: [
        { label: "Mapa oscuro", layer: baseOscuro },
        { label: "Satélite", layer: baseSatelite }
      ]
    };

    var overlaysTree = {
      label: "📂 Capas",
      children: [
        {
          label: "Territorios",
          children: [
            { label: "Territorios indígenas", layer: territoriosLayer }
          ]
        }
      ]
    };

    L.control.layers.tree(baseTree, overlaysTree, {
      collapsed: false
    }).addTo(map);

    // Zoom inicial
    map.fitBounds(territoriosLayer.getBounds());

  })
  .catch(err => console.error('Error cargando GeoJSON:', err));

