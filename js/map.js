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
// VARIABLES GLOBALES (PANEL)
// ===============================

window.territorioActivo = null;
window.featureActivo = null;

// ===============================
// COLORES POR CLASIFICACIÓN
// (VIENE DEL GEOJSON)
// ===============================

function colorPorClasif(clasif) {
  switch (clasif) {
    case "CREF y PAFS":
      return "#c67c2d"; // café
    case "Solo PAFS":
      return "#f2c94c"; // amarillo
    case "Sin CREF ni PAFS":
      return "#d9d9d9"; // gris claro
    default:
      return "#d9d9d9";
  }
}

// ===============================
// CARGA DE TERRITORIOS INDÍGENAS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(res => res.json())
  .then(data => {

    const capaTerritorios = L.geoJSON(data, {

      style: feature => {
        const clasif = feature.properties.Clasif || "Sin CREF ni PAFS";

        return {
          color: "#444",
          weight: 1,
          fillColor: colorPorClasif(clasif),
          fillOpacity: clasif === "Sin CREF ni PAFS" ? 0.4 : 0.8
        };
      },

      onEachFeature: (feature, layer) => {
        const nombre = feature.properties.TERRITORIO
          ?.trim()
          .toUpperCase();

        const clasif = feature.properties.Clasif || "Sin CREF ni PAFS";
        const datos = CREF_DATA[nombre] || null;

        // TOOLTIP
        layer.bindTooltip(
          `<strong>${nombre}</strong><br>${clasif}`,
          { sticky: true }
        );

        // CLICK → PANEL + ZOOM
        layer.on("click", () => {
          window.territorioActivo = nombre;
          window.featureActivo = feature;

          actualizarPanel(nombre, feature);

          map.fitBounds(layer.getBounds(), {
            padding: [30, 30],
            maxZoom: 12
          });
        });
      }
    });

    capaTerritorios.addTo(map);
  })
  .catch(err => console.error("Error cargando territorios:", err));
