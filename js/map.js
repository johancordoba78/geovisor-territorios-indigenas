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
// ESTILO TERRITORIOS (NORMAL)
// ===============================
function estiloNormal() {
  return {
    color: '#ffffff',     // borde blanco
    weight: 2,
    opacity: 1,
    fillColor: '#ff5500', // naranja
    fillOpacity: 0.65
  };
}

// ===============================
// HOVER (RESALTADO)
// ===============================
function estiloHover(e) {
  e.target.setStyle({
    color: '#FFD700',     // amarillo
    weight: 3,
    fillColor: '#ff8800',
    fillOpacity: 0.85
  });

  e.target.bringToFront();
}

function resetHover(e) {
  territorios.resetStyle(e.target);
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
    mouseover: estiloHover,
    mouseout: resetHover,
    click: function () {
      map.fitBounds(layer.getBounds(), {
        padding: [20, 20],
        animate: true,
        duration: 0.6
      });
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

    // ---- CAPA DE TERRITORIOS ----
    territorios = L.geoJSON(data, {
      style: estiloNormal,
      onEachFeature: onEachFeature
    }).addTo(map);

    map.fitBounds(territorios.getBounds());

    // ---- CONTROL DE CAPAS ----
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
    // BUSCADOR DE TERRITORIOS
    // ===============================
    var searchControl = new L.Control.Search({
      layer: territorios,
      propertyName: 'TERRITORIO',
      marker: false,
      moveToLocation: function (latlng, title, map) {
        map.fitBounds(latlng.layer.getBounds(), {
          padding: [20, 20],
          animate: true,
          duration: 0.8
        });
      }
    });

    searchControl.on('search:locationfound', function (e) {
      e.layer.openPopup();

      e.layer.setStyle({
        color: '#FFD700',
        weight: 3,
        fillColor: '#ff8800',
        fillOpacity: 0.9
      });

      if (e.layer.bringToFront) {
        e.layer.bringToFront();
      }
    });

    searchControl.on('search:collapsed', function () {
      territorios.eachLayer(function (layer) {
        territorios.resetStyle(layer);
      });
    });

    map.addControl(searchControl);
  })
  .catch(err => console.error('Error cargando GeoJSON:', err));
// ===============================
// BOTÓN VISTA GENERAL
// ===============================
document.getElementById('btnHome').addEventListener('click', function () {

  // Cerrar popups
  map.closePopup();

  // Resetear estilos
  territorios.eachLayer(function (layer) {
    territorios.resetStyle(layer);
  });

  // Volver a vista general
  map.fitBounds(territorios.getBounds(), {
    padding: [30, 30],
    animate: true,
    duration: 0.8
  });
});
