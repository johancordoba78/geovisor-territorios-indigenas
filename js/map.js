var map = L.map('map').setView([9.8, -83.7], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

function estiloTerritorios() {
  return {
    color: '#1b5e20',
    weight: 1.5,
    fillColor: '#66bb6a',
    fillOpacity: 0.5
  };
}

function onEachFeature(feature, layer) {
  var p = feature.properties;

  var foto = p.FOTO ? p.FOTO : 'fotos/sin_foto.jpg';
  var ficha = p.FICHA ? p.FICHA : 'fichas/en_construccion.html';

  var html = `
    <div class="popup-title">${p.TERRITORIO}</div>
    <img src="${foto}" class="popup-img">
    <table class="popup-table">
      <tr><td><b>Decreto:</b></td><td>${p.DECRETO}</td></tr>
      <tr><td><b>Año:</b></td><td>${p.AÑO}</td></tr>
      <tr><td><b>Clasificación:</b></td><td>${p.CLASIF}</td></tr>
      <tr><td><b>Área (ha):</b></td><td>${Number(p.AREA_HA).toFixed(2)}</td></tr>
    </table>
    <a href="${ficha}" target="_blank" class="popup-btn">Ver ficha técnica</a>
  `;

  layer.bindPopup(html);
}

fetch('data/territorios_indigenas.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: estiloTerritorios,
      onEachFeature: onEachFeature
    }).addTo(map);
  });
