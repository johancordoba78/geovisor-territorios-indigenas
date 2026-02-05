// ===============================
// MAPA BASE
// ===============================
var map = L.map('map').setView([9.8, -83.7], 8);

// Fondo negro real
map.getContainer().style.background = '#000000';

// Capa base oscura (CARTO)
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }
).addTo(map);

// ===============================
// PANE EXCLUSIVO PARA TERRITORIOS
// ===============================
map.createPane('territoriosPane');
map.getPane('territoriosPane').style.zIndex = 400;

// ===============================
// ESTILO NORMAL DE TERRITORIOS
// ===============================
function estiloTerritorios() {
  return {
    pane: 'territoriosPane',
    color: '#FFFFFF',      // ⚪ borde blanco
    weight: 1.5,
    fillColor: '#FF8C00',  // 🟧 anaranjado
    fillOpacity: 0.65,
    interactive: true
  };
}

// ===============================
// ESTILO HOVER (RESALTADO)
// ===============================
function highlightFeature(e) {
  const layer = e.target;

  layer.setStyle({
    color: '#FFD700',     // 🟨 amarillo
    weight: 3,
    fillOpacity: 0.85
  });

  layer.bringToFront();
}

// ===============================
// RESETEAR ESTILO
// ===============================
function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

// ===============================
// POPUP + EVENTOS
// ===============================
function onEachFeature(feature, layer) {
  const p = feature.properties;

  const foto  = p.FOTO  ? p.FOTO  : 'fotos/sin_foto.jpg';
  const ficha = p.FICHA ? p.FICHA : 'fichas/en_construccion.html';

  const html = `
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

  // Eventos hover
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
  });
}

// ===============================
// CARGA DEL GEOJSON
// ===============================
let geojson;

fetch('data/territorios_indigenas.geojson')
  .then(r => r.json())
  .then(data => {
    geojson = L.geoJSON(data, {
      style: estiloTerritorios,
      onEachFeature: onEachFeature
    }).addTo(map);
  })
  .catch(err => console.error('Error cargando GeoJSON:', err));
