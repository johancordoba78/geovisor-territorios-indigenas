// ===============================
// MAPA BASE
// ===============================

const map = L.map("map", {
  center: [9.6, -84.2],
  zoom: 7,
  layers: [baseMaps["OpenStreetMap"]]
});

// Control de mapas base
L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);

// ===============================
// VARIABLES GLOBALES
// ===============================

window.territorioActivo = null;
window.featureActivo = null;

// ===============================
// ESTILO POR CLASIFICACIÓN (GeoJSON)
// ===============================

function estiloTerritorio(feature) {
  const clasif = feature.properties?.Clasif ?? "Sin CREF ni PAFs";

  let fillColor = "#999999"; // gris

  if (clasif === "CREF y PAFs") fillColor = "#c67c2d";
  if (clasif === "Solo PAFs") fillColor = "#f2c94c";

  return {
    color: "#444",
    weight: 1,
    fillColor,
    fillOpacity: 0.7
  };
}

// ===============================
// CARGA DE TERRITORIOS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(res => res.json())
  .then(data => {

    L.geoJSON(data, {
      style: estiloTerritorio,

      onEachFeature: (feature, layer) => {
        const nombre = feature.properties.TERRITORIO
          ?.trim()
          .toUpperCase();

        const clasif = feature.properties?.Clasif ?? "Sin CREF ni PAFs";

        // Tooltip
        layer.bindTooltip(
          `<strong>${nombre}</strong><br>${clasif}`,
          { sticky: true }
        );

        // Click
        layer.on("click", () => {
          window.territorioActivo = nombre;
          window.featureActivo = feature;

          actualizarPanel(nombre, feature);
        });
      }
    }).addTo(map);
  })
  .catch(err => console.error("Error cargando territorios:", err));

