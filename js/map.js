const map = L.map("map", {
  center: [9.6, -84.2],
  zoom: 7,
  layers: [baseMaps["OpenStreetMap"]]
});

function estiloTerritorio(feature) {
  const nombre = feature.properties.TERRITORIO?.trim().toUpperCase();
  const datos = CREF_DATA[nombre];
  let fill = "#999";
  if (datos?.clasif === "CREF y PAFs") fill = "#c67c2d";
  return { color: "#444", weight: 1, fillColor: fill, fillOpacity: 0.7 };
}

fetch("data/territorios_indigenas.geojson")
  .then(r => r.json())
  .then(data => {
    L.geoJSON(data, {
      style: estiloTerritorio,
      onEachFeature: (feature, layer) => {
        const nombre = feature.properties.TERRITORIO
          ?.trim()
          .toUpperCase();
        layer.on("click", () => {
          actualizarPanel(nombre, CREF_DATA[nombre]);
        });
      }
    }).addTo(map);
  });
