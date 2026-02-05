// ===============================
// MAPAS BASE
// ===============================

// Oscuro
var baseOscuro = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
);

// Satélite
var baseSatelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri' }
);

// OpenStreetMap
var baseOSM = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '&copy; OpenStreetMap contributors' }
);

// Base por defecto
baseOscuro.addTo(map);

// ===============================
// ESTILOS TERRITORIOS
// ===============================
function estiloNormal() {
  return {
    color: '#ffffff',
    weight: 2,
    fillColor: '#ff5500',
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
  e.target.bringToFront();
}

function resetHover(e) {
  territorios.resetStyle(e.target);
}

// ===============================
// POPUP
// ===============================
function onEachFeature(feature, layer) {
  var p = feature.properties;

  var htmlPopup = `
    <div class="popup-title">${p.TERRITORIO}</div>
    <table class="popup-table">
      <tr><td><b>Decreto</b></td><td>${p.DECRETO}</td></tr>
      <tr><td><b>Año</b></td><td>${p.AÑO}</td></tr>
      <tr><td><b>Clasificación</b></td><td>${p.CLASIF}</td></tr>
      <tr><td><b>Área (ha)</b></td><td>${p.AREA_HA}</td></tr>
    </table>
  `;

  var htmlSidebar = `
    <h3>${p.TERRITORIO}</h3>
    <table class="popup-table">
      <tr><td><b>Decreto</b></td><td>${p.DECRETO}</td></tr>
      <tr><td><b>Año</b></td><td>${p.AÑO}</td></tr>
      <tr><td><b>Clasificación</b></td><td>${p.CLASIF}</td></tr>
      <tr><td><b>Área (ha)</b></td><td>${p.AREA_HA}</td></tr>
    </table>
  `;

  layer.bindPopup(htmlPopup);

  layer.on({
    mouseover: estiloHover,
    mouseout: resetHover,
    click: function () {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });

      document.getElementById('sidebar-content').innerHTML = htmlSidebar;
    }
  });
}

// ===============================
// CARGA GEOJSON
// ===============================
var territorios;
var boundsGeneral;

fetch('data/territorios_indigenas.geojson')
  .then(res => res.json())
  .then(data => {

    territorios = L.geoJSON(data, {
      style: estiloNormal,
      onEachFeature: onEachFeature
    }).addTo(map);

    boundsGeneral = territorios.getBounds();
    map.fitBounds(boundsGeneral);

    // ===============================
    // CONTROL DE CAPAS
    // ===============================
    L.control.layers(
      {
        "Mapa oscuro": baseOscuro,
        "Satélite": baseSatelite,
        "OpenStreetMap": baseOSM
      },
      {
        "Territorios indígenas": territorios
      },
      { collapsed: false }
    ).addTo(map);

    // ===============================
    // BUSCADOR
    // ===============================
    var searchControl = new L.Control.Search({
      layer: territorios,
      propertyName: 'TERRITORIO',
      marker: false,
      moveToLocation: function (latlng, title, map) {
        map.fitBounds(latlng.layer.getBounds(), {
          padding: [20, 20],
          animate: true
        });
      }
    });

    searchControl.on('search:locationfound', function (e) {
      e.layer.openPopup();
      estiloHover({ target: e.layer });
    });

    searchControl.on('search:collapsed', function () {
      territorios.eachLayer(function (layer) {
        territorios.resetStyle(layer);
      });
    });

    map.addControl(searchControl);

    // ===============================
    // BOTÓN VISTA GENERAL
    // ===============================
    var btnHome = L.control({ position: 'topleft' });

    btnHome.onAdd = function () {
      var div = L.DomUtil.create('div', 'btn-home');
      div.innerHTML = '🌎 Vista general';
      div.onclick = function () {
        map.fitBounds(boundsGeneral);
      };
      return div;
    };

    btnHome.addTo(map);

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
