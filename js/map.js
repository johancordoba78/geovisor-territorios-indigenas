// ===============================
// MAPA BASE
// ===============================

const baseMaps = {
  "OpenStreetMap": L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "© OpenStreetMap" }
  ),
  "Carto Claro": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    { attribution: "© CARTO" }
  )
};

const map = L.map("map", {
  center: [9.6, -84.2],
  zoom: 7,
  layers: [baseMaps["OpenStreetMap"]]
});

L.control.layers(baseMaps, null).addTo(map);

// ===============================
// ESTILO SEGÚN CLASIF (GeoJSON)
// ===============================

function estiloTerritorio(feature) {
  const clasif = feature.properties.CLASIF?.trim();

  let fillColor = "#999999"; // Sin CREF ni PAFTS
  if (clasif === "CREF y PAFTS") fillColor = "#c67c2d";
  else if (clasif === "Solo PAFTS") fillColor = "#f2c94c";

  return {
    color: "#333",
    weight: 1,
    fillColor,
    fillOpacity: 0.7
  };
}

// ===============================
// TERRITORIOS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(res => res.json())
  .then(data => {

    L.geoJSON(data, {
      style: estiloTerritorio,

      onEachFeature: (feature, layer) => {
        const nombre = feature.properties.TERRITORIO.trim().toUpperCase();
        const clasif = feature.properties.CLASIF;

        layer.bindTooltip(
          `<strong>${nombre}</strong><br>${clasif}`,
          { sticky: true }
        );

        layer.on("click", () => {
          actualizarPanel(nombre);
        });
      }
    }).addTo(map);

  })
  .catch(err => console.error(err));
