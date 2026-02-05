var map = L.map('map').setView([9.8, -83.7], 7);

L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap &copy; CARTO' }
).addTo(map);

function estiloNormal() {
  return {
    color: '#ffffff',
    weight: 2,
    fillColor: '#ff6600',
    fillOpacity: 0.7
  };
}

fetch('./data/territorios_indigenas.geojson')
  .then(r => {
    if (!r.ok) throw new Error('NO carga el GeoJSON');
    return r.json();
  })
  .then(data => {
    console.log('GeoJSON cargado:', data);

    L.geoJSON(data, {
      style: estiloNormal
    }).addTo(map);

    map.fitBounds(L.geoJSON(data).getBounds());
  })
  .catch(err => {
    console.error('ERROR:', err);
    alert('❌ NO se pudo cargar el GeoJSON');
  });

