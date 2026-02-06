// ===============================
// CARGA DE TERRITORIOS INDÍGENAS
// ===============================

fetch('data/territorios_indigenas.geojson')
  .then(res => res.json())
  .then(data => {

    // Enlazar CSV CREF con GeoJSON
    data.features.forEach(f => {
      const nombre = f.properties.TERRITORIO
        ? f.properties.TERRITORIO.trim().toUpperCase()
        : null;

      if (nombre && CREF_DATA[nombre]) {
        f.properties.CREF = CREF_DATA[nombre];
        f.properties.TIENE_CREF = true;
      } else {
        f.properties.CREF = null;
        f.properties.TIENE_CREF = false;
      }
    });

    console.log('✔ GeoJSON enlazado con CREF');

    // Capa Leaflet
    L.geoJSON(data, {
      style: feature => ({
        color: '#ffffff',
        weight: 1,
        fillColor: feature.properties.TIENE_CREF ? '#c76b00' : '#555555',
        fillOpacity: 0.7
      }),
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          console.log('Territorio clickeado:', feature.properties.TERRITORIO);
          console.log('Datos CREF:', feature.properties.CREF);
        });
      }
    }).addTo(map);

  })
  .catch(err => console.error('❌ Error cargando GeoJSON:', err));
