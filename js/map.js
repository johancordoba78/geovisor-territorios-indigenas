// ===============================
// MAPA
// ===============================
var map = L.map('map').setView([9.8, -83.7], 8);

// ===============================
// MAPAS BASE
// ===============================
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
).addTo(map);

var baseSatelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri' }
);

// ===============================
// ESTILO TERRITORIOS
// ===============================
function estiloNormal() {
  return {
    color: '#ffffff',     // borde blanco
    weight: 2,
    fillColor: '#ff5500', // naranja
    fillOpacity: 0.65
  };
}

function estiloHover(e) {
  e.target.setStyle({
    color: '#FFD700',
    weight: 3,
    fillColor: '#ff8800',
    fillOpacity: 0.85
  });
}

function resetHover(e) {
  territorios.resetStyle(e.target);
}

// ===============================
// POPUP
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
    mouseover: estiloHover,
    mouseout: resetHover,
    click: function () {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
  });
}

// ===============================
// CARGA GEOJSON
// ===============================
var territorios;

fetch('data/territorios_indigenas.geojson')
  .then(res => res.json())
  .then(data => {

    territorios = L.geoJSON(data, {
      style: estiloNormal,
      onEachFeature: onEachFeature
    }).addTo(map);

    map.fitBounds(territorios.getBounds());

    // ===============================
    // CONTROL DE CAPAS (NORMAL)
    // ===============================
    L.control.layers(
      {
        "Mapa oscuro": baseOscuro,
        "Satélite": baseSatelite
      },
      {
        "Territorios indígenas": territorios
      },
      { collapsed: false }
    ).addTo(map);

    // ===============================
    // LEYENDA
    // ===============================
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `
        <b>Territorios</b><br>
        <i style="background:#ff5500"></i> Territorio indígena<br>
        <i style="background:#FFD700"></i> En foco
      `;
      return div;
    };

    legend.addTo(map);
  })
  .catch(err => console.error(err));

